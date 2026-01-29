import consola from 'consola';
import { IAbstract, ICrawler, IDateRange } from '../crawler.interface';
import { IPaperAbstract } from './paper_crawler.interface';

/**
 * HuggingFace API 响应数据接口
 */
interface HFPaperResponse {
  paper: {
    id: string;
    authors: {
      name: string;
    }[];
    upvotes?: number;
    githubRepo?: string;
    ai_summary?: string;
    ai_keywords?: string[];
    organization?: {
      name: string;
    };
  };
  publishedAt: string;
  title: string;
  summary: string;
  thumbnail?: string;
  organization?: {
    name: string;
  };
}

/**
 * HuggingFace Fetcher 实现类
 * 专门用于从 HuggingFace 获取论文信息
 */
export class HuggingFaceCrawler implements ICrawler {
  private readonly apiBaseUrl = 'https://huggingface.co/api';
  private readonly searchEndpoint = '/papers/search';
  private readonly dailyPaperEndpoint = '/daily_papers';

  public async daily(range?: IDateRange): Promise<IAbstract[]> {
    const raws = await this.fetchAll(`${this.apiBaseUrl}${this.dailyPaperEndpoint}`, range);
    return raws.map((raw) => this.transform(raw));
  }

  public async search(query: string, range?: IDateRange): Promise<IAbstract[]> {
    const raws = await this.fetchAll(
      `${this.apiBaseUrl}${this.searchEndpoint}?q=${encodeURIComponent(query)}`,
      range
    );
    return raws.map((raw) => this.transform(raw));
  }

  private async fetchAll(endpoint: string, range?: IDateRange): Promise<HFPaperResponse[]> {
    if (!range || !range.start) {
      return await this.fetch(endpoint);
    }

    const results: HFPaperResponse[] = [];
    const startDate = new Date(range.start);
    const endDate = range.end ? new Date(range.end) : new Date();

    for (
      let currentDate = new Date(startDate);
      currentDate <= endDate;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      const dailyResults = await this.fetch(endpoint, new Date(currentDate));
      results.push(...dailyResults);
    }

    return results;
  }

  private async fetch(endpoint: string, date?: Date): Promise<HFPaperResponse[]> {
    try {
      const url = date ? `${endpoint}?date=${date.toISOString().substring(0, 10)}` : endpoint;
      const response = await fetch(url);

      if (!response.ok) {
        consola.error(`HTTP error! status: ${response.status}`);
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      consola.error('Failed to fetch raw data from HuggingFace:', error);
      return [];
    }
  }

  /**
   * 转换原始数据为统一格式 - 实现父类抽象方法
   */
  private transform(paper: HFPaperResponse): IPaperAbstract {
    return {
      title: paper.title.trim(),
      authors: this.extractAuthors(paper.paper.authors),
      organization: paper.organization?.name,
      publishedAt: new Date(paper.publishedAt),
      summary: paper.summary.trim(),
      url: this.constructPDFUrl(paper.paper.id),
      likes: paper.paper.upvotes ?? 0,
      id: paper.paper.id,
      repoUrl: paper.paper.githubRepo,
    };
  }

  private extractAuthors(authors: HFPaperResponse['paper']['authors']): string[] {
    if (!authors || !Array.isArray(authors)) return [];
    return authors
      .map((author) => {
        return author.name || '';
      })
      .filter((name) => name.trim() !== '');
  }

  /**
   * 构建 PDF 下载链接
   */
  private constructPDFUrl(paperId: string): string {
    return `https://huggingface.co/papers/${paperId}/pdf`;
  }
}
