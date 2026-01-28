/**
 * 统一的论文信息接口
 */
export interface PaperInfo {
  /** 论文标题 */
  title: string;
  /** 发布时间 */
  publishedAt: Date;
  /** 论文摘要 */
  abstract: string;
  /** 论文链接 */
  url: string;
  /** 作者列表 */
  authors: string[];
  /** 分类标签 */
  categories: string[];
  /** 评分/热度 */
  score?: number;
}

/**
 * 论文详细信息接口
 */
export interface PaperDetails extends PaperInfo {
  /** 论文 ID */
  id: string;
  /** DOI */
  doi?: string;
  /** 引用量 */
  citations?: number;
  /** 下载量 */
  downloads?: number;
  /** 相关论文 */
  relatedPapers?: string[];
  /** 论文全文链接 */
  pdfUrl?: string;
  /** 代码仓库链接 */
  codeUrl?: string;
  /** 数据集链接 */
  datasetUrl?: string;
  /** 论文状态 */
  status?: 'published' | 'preprint' | 'draft';
  /** 更新时间 */
  updatedAt?: Date;
  /** 版本信息 */
  versions?: string[];
  /** 评论数 */
  comments?: number;
}

/**
 * 过滤器选项接口
 */
export interface FilterOptions {
  /** 时间范围（开始日期） */
  startDate?: Date;
  /** 时间范围（结束日期） */
  endDate?: Date;
  /** 最小评分 */
  minScore?: number;
  /** 关键词列表 */
  keywords?: string[];
  /** 分类筛选 */
  categories?: string[];
}

/**
 * Fetcher 基础接口
 */
export interface IFetcher {
  /**
   * 获取论文数据
   * @param filters 过滤器选项
   */
  fetchPapers(filters?: FilterOptions): Promise<PaperInfo[]>;
  
  /**
   * 获取单篇论文详细信息
   * @param paperId 论文标识符
   */
  fetchPaperDetails(paperId: string): Promise<PaperDetails>;
  
  /**
   * 搜索论文
   * @param query 搜索查询
   * @param filters 过滤器选项
   */
  searchPapers(query: string, filters?: FilterOptions): Promise<PaperInfo[]>;
  
  /**
   * 获取热门论文
   * @param limit 数量限制
   */
  getTrendingPapers(limit?: number): Promise<PaperInfo[]>;
  
  /**
   * 获取最新论文
   * @param limit 数量限制
   */
  getLatestPapers(limit?: number): Promise<PaperInfo[]>;
}