import { IContextSeed } from '../crawler.interface';

export interface IPaperSeed extends IContextSeed {
  id: string;
  repoUrl?: string;
}
