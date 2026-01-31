export interface IContextSeed {
  title: string;
  authors: string[];
  organization?: string;
  publishedAt: string;
  summary: string;
  url: string;
  likes?: number;
  hot?: boolean;
}

export interface IDateRange {
  start?: Date;
  end?: Date;
}

export interface ICrawler {
  daily(range?: IDateRange): Promise<IContextSeed[]>;
  search(keyword: string, range?: IDateRange): Promise<IContextSeed[]>;
}
