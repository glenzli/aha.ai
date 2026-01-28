import { IAbstract } from '../crawler.interface';

export interface IPaperAbstract extends IAbstract {
  id: string;
  repoUrl?: string;
}
