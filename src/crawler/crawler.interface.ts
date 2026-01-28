/** 统一信息接口 */
export interface IAbstract {
  title: string;
  authors: string[];
  organization?: string;
  publishedAt: Date;
  summary: string;
  url: string;
  likes?: number;
}

export interface IDateRange {
  start?: Date;
  end?: Date;
}

export interface ICrawler {
  daily(range?: IDateRange): Promise<IAbstract[]>;
  search(query: string, range?: IDateRange): Promise<IAbstract[]>;
}
