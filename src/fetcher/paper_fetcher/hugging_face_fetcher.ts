import { BaseFetcher } from './base_fetcher';
import { FilterOptions, PaperInfo, PaperDetails } from './interfaces';

/**
 * HuggingFace API 响应数据接口
 */
interface HFPaperResponse {
  id: string;
  title: string;
  summary: string;
  author: string | { name: string }[];
  publishedAt: string;
  updatedAt?: string;
  url: string;
  doi?: string;
  likes?: number;
  downloads?: number;
  discussions?: number;
  tags?: string[];
  license?: string;
  datasets?: string[];
  models?: string[];
  spaces?: string[];
  paper?: {
    citationCount?: number;
    referenceCount?: number;
    venue?: string;
    year?: number;
  };
  metrics?: {
    trendingScore?: number;
    popularityScore?: number;
  };
}

/**
 * HuggingFace 搜索响应接口
 */
interface HFSearchResponse {
  papers: HFPaperResponse[];
  totalCount: number;
  next?: string;
}

/**
 * HuggingFace Fetcher 实现类
 * 专门用于从 HuggingFace 获取论文信息
 */
export class HuggingFaceFetcher extends BaseFetcher {
  private readonly apiBaseUrl = 'https://huggingface.co/api';
  private readonly searchEndpoint = '/papers/search';
  private readonly paperEndpoint = '/papers';

  constructor() {
    super('https://huggingface.co');
  }

  /**
   * 获取原始数据 - 实现父类抽象方法
   */
  protected async fetchRawData(): Promise<HFPaperResponse[]> {
    try {
      // 获取最新的论文数据
      const response = await fetch(`${this.apiBaseUrl}${this.paperEndpoint}?limit=100`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Failed to fetch raw data from HuggingFace:', error);
      throw error;
    }
  }

  /**
   * 转换原始数据为统一格式 - 实现父类抽象方法
   */
  protected transformToPaperInfo(rawData: unknown): PaperInfo {
    const paper = rawData as HFPaperResponse;

    return {
      title: this.cleanText(paper.title),
      publishedAt: this.formatDate(paper.publishedAt),
      abstract: this.cleanText(paper.summary),
      url: paper.url,
      authors: this.extractAuthors(Array.isArray(paper.author) ? paper.author : [paper.author]),
      categories: this.extractHFCategoryTags(paper),
      score: this.calculateHFScore(paper),
    };
  }

  /**
   * 获取单篇论文详细信息 - 实现接口方法
   */
  async fetchPaperDetails(paperId: string): Promise<PaperDetails> {
    try {
      const response = await fetch(`${this.apiBaseUrl}${this.paperEndpoint}/${paperId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const paper = (await response.json()) as HFPaperResponse;

      return {
        id: paper.id,
        title: this.cleanText(paper.title),
        publishedAt: this.formatDate(paper.publishedAt),
        abstract: this.cleanText(paper.summary),
        url: paper.url,
        authors: this.extractAuthors(Array.isArray(paper.author) ? paper.author : [paper.author]),
        categories: this.extractHFCategoryTags(paper),
        score: this.calculateHFScore(paper),
        doi: paper.doi,
        citations: paper.paper?.citationCount,
        downloads: paper.downloads,
        relatedPapers: [], // HuggingFace API 不直接提供相关论文
        pdfUrl: this.constructPDFUrl(paper.id),
        codeUrl: this.constructCodeUrl(paper.id),
        datasetUrl: this.constructDatasetUrl(paper.datasets),
        status: this.determinePaperStatus(paper),
        updatedAt: paper.updatedAt ? this.formatDate(paper.updatedAt) : undefined,
        versions: [], // HuggingFace 不使用版本概念
        comments: paper.discussions,
      };
    } catch (error) {
      console.error(`Failed to fetch paper details for ${paperId}:`, error);
      throw error;
    }
  }

  /**
   * 搜索论文 - 重写父类方法以使用 HuggingFace 搜索API
   */
  async searchPapers(query: string, filters?: FilterOptions): Promise<PaperInfo[]> {
    try {
      const searchParams = new URLSearchParams({
        q: query,
        limit: '100',
      });

      // 添加时间过滤
      if (filters?.startDate) {
        searchParams.append('published_after', filters.startDate.toISOString().split('T')[0]);
      }
      if (filters?.endDate) {
        searchParams.append('published_before', filters.endDate.toISOString().split('T')[0]);
      }

      const response = await fetch(
        `${this.apiBaseUrl}${this.searchEndpoint}?${searchParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const searchData = (await response.json()) as HFSearchResponse;
      const papers = searchData.papers.map((paper) => this.transformToPaperInfo(paper));

      // 应用额外的过滤器
      return this.applyFilters(papers, filters);
    } catch (error) {
      console.error('Failed to search papers on HuggingFace:', error);
      throw error;
    }
  }

  /**
   * 从 HuggingFace 数据中提取分类标签
   */
  private extractHFCategoryTags(paper: HFPaperResponse): string[] {
    const categories: string[] = [];

    // 从 tags 提取
    if (paper.tags && Array.isArray(paper.tags)) {
      categories.push(...paper.tags);
    }

    // 从 datasets 提取
    if (paper.datasets && Array.isArray(paper.datasets)) {
      categories.push(...paper.datasets.map((dataset) => `dataset:${dataset}`));
    }

    // 从 models 提取
    if (paper.models && Array.isArray(paper.models)) {
      categories.push(...paper.models.map((model) => `model:${model}`));
    }

    // 从 spaces 提取
    if (paper.spaces && Array.isArray(paper.spaces)) {
      categories.push(...paper.spaces.map((space) => `space:${space}`));
    }

    // 从论文元数据提取
    if (paper.paper?.venue) {
      categories.push(`venue:${paper.paper.venue}`);
    }

    if (paper.paper?.year) {
      categories.push(`year:${paper.paper.year}`);
    }

    return [...new Set(categories)]; // 去重
  }

  /**
   * 计算 HuggingFace 论文评分
   */
  private calculateHFScore(paper: HFPaperResponse): number {
    let score = 0;

    // 基于点赞数
    if (paper.likes && paper.likes > 0) {
      score += Math.log10(paper.likes + 1) * 10;
    }

    // 基于下载量
    if (paper.downloads && paper.downloads > 0) {
      score += Math.log10(paper.downloads + 1) * 5;
    }

    // 基于讨论数
    if (paper.discussions && paper.discussions > 0) {
      score += Math.log10(paper.discussions + 1) * 3;
    }

    // 基于引用数
    if (paper.paper?.citationCount && paper.paper.citationCount > 0) {
      score += Math.log10(paper.paper.citationCount + 1) * 8;
    }

    // 基于趋势分数
    if (paper.metrics?.trendingScore) {
      score += paper.metrics.trendingScore * 2;
    }

    // 基于流行度分数
    if (paper.metrics?.popularityScore) {
      score += paper.metrics.popularityScore;
    }

    return Math.round(score * 100) / 100; // 保留两位小数
  }

  /**
   * 构建 PDF 下载链接
   */
  private constructPDFUrl(paperId: string): string {
    return `https://huggingface.co/papers/${paperId}/pdf`;
  }

  /**
   * 构建代码仓库链接
   */
  private constructCodeUrl(paperId: string): string {
    return `https://huggingface.co/papers/${paperId}/code`;
  }

  /**
   * 构建数据集链接
   */
  private constructDatasetUrl(datasets?: string[]): string | undefined {
    if (!datasets || datasets.length === 0) return undefined;
    // 返回第一个数据集的链接
    return `https://huggingface.co/datasets/${datasets[0]}`;
  }

  /**
   * 确定论文状态
   */
  private determinePaperStatus(paper: HFPaperResponse): 'published' | 'preprint' | 'draft' {
    // 简单的状态判断逻辑
    if (paper.doi) {
      return 'published';
    } else if (paper.paper?.venue) {
      return 'published';
    } else {
      return 'preprint';
    }
  }

  /**
   * 获取每日热门论文
   */
  async getDailyTrendingPapers(limit: number = 20): Promise<PaperInfo[]> {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    return this.fetchPapers({
      startDate: yesterday,
      endDate: today,
      minScore: 10, // 只获取有一定热度的论文
    }).then((papers) => papers.sort((a, b) => (b.score || 0) - (a.score || 0)).slice(0, limit));
  }

  /**
   * 获取特定领域的论文
   */
  async getPapersByDomain(domain: string, limit: number = 50): Promise<PaperInfo[]> {
    return this.searchPapers(domain).then((papers) => papers.slice(0, limit));
  }
}
