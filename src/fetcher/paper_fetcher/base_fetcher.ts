import { FilterOptions, PaperInfo } from './interfaces';

/**
 * Fetcher 抽象基类
 * 提供通用的过滤和处理逻辑
 */
export abstract class BaseFetcher {
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * 抽象方法：获取原始数据
   */
  protected abstract fetchRawData(filters?: FilterOptions): Promise<unknown[]>;

  /**
   * 抽象方法：转换原始数据为统一格式
   */
  protected abstract transformToPaperInfo(rawData: unknown): PaperInfo;

  /**
   * 获取单篇论文详细信息
   * @param paperId 论文标识符
   */
  abstract fetchPaperDetails(paperId: string): Promise<unknown>;

  /**
   * 获取论文数据
   */
  async fetchPapers(filters?: FilterOptions): Promise<PaperInfo[]> {
    try {
      const rawData = await this.fetchRawData(filters);
      const papers = rawData.map((item) => this.transformToPaperInfo(item));

      // 应用过滤器
      return this.applyFilters(papers, filters);
    } catch (error) {
      console.error('Failed to fetch papers:', error);
      throw new Error(`Failed to fetch papers: ${error}`);
    }
  }

  /**
   * 搜索论文
   */
  async searchPapers(query: string, filters?: FilterOptions): Promise<PaperInfo[]> {
    const allPapers = await this.fetchPapers(filters);
    return allPapers.filter(
      (paper) =>
        paper.title.toLowerCase().includes(query.toLowerCase()) ||
        paper.abstract.toLowerCase().includes(query.toLowerCase()) ||
        paper.authors.some((author) => author.toLowerCase().includes(query.toLowerCase())) ||
        paper.categories.some((category) => category.toLowerCase().includes(query.toLowerCase()))
    );
  }

  /**
   * 获取热门论文
   */
  async getTrendingPapers(limit: number = 10): Promise<PaperInfo[]> {
    const papers = await this.fetchPapers();
    return papers
      .filter((paper) => paper.score !== undefined)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, limit);
  }

  /**
   * 获取最新论文
   */
  async getLatestPapers(limit: number = 10): Promise<PaperInfo[]> {
    const papers = await this.fetchPapers();
    return papers.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()).slice(0, limit);
  }

  /**
   * 应用过滤器
   */
  protected applyFilters(papers: PaperInfo[], filters?: FilterOptions): PaperInfo[] {
    if (!filters) return papers;

    return papers.filter((paper) => {
      // 时间范围过滤
      if (filters.startDate && paper.publishedAt < filters.startDate) {
        return false;
      }
      if (filters.endDate && paper.publishedAt > filters.endDate) {
        return false;
      }

      // 评分过滤
      if (filters.minScore && (paper.score === undefined || paper.score < filters.minScore)) {
        return false;
      }

      // 关键词过滤
      if (filters.keywords && filters.keywords.length > 0) {
        const hasKeyword = filters.keywords.some(
          (keyword) =>
            paper.title.toLowerCase().includes(keyword.toLowerCase()) ||
            paper.abstract.toLowerCase().includes(keyword.toLowerCase()) ||
            paper.authors.some((author) => author.toLowerCase().includes(keyword.toLowerCase()))
        );
        if (!hasKeyword) return false;
      }

      // 分类过滤
      if (filters.categories && filters.categories.length > 0) {
        const hasCategory = filters.categories.some((category) =>
          paper.categories.some((paperCategory) =>
            paperCategory.toLowerCase().includes(category.toLowerCase())
          )
        );
        if (!hasCategory) return false;
      }

      return true;
    });
  }

  /**
   * 格式化日期
   */
  protected formatDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * 清理文本内容
   */
  protected cleanText(text: string): string {
    return text?.trim() || '';
  }

  /**
   * 抽取作者列表
   */
  protected extractAuthors(authors: unknown[]): string[] {
    if (!authors || !Array.isArray(authors)) return [];
    return authors
      .map((author) => {
        if (typeof author === 'string') return author;
        const typedAuthor = author as { name?: string };
        return typedAuthor.name || '';
      })
      .filter((name) => name.trim() !== '');
  }

  /**
   * 抽取分类标签
   */
  protected extractCategories(categories: unknown[]): string[] {
    if (!categories || !Array.isArray(categories)) return [];
    return categories
      .map((category) => {
        if (typeof category === 'string') return category;
        const typedCategory = category as { name?: string; id?: string };
        return typedCategory.name || typedCategory.id || '';
      })
      .filter((name) => name.trim() !== '');
  }
}
