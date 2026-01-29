import { ICrawler } from './crawler.interface';
import { HuggingFaceCrawler } from './paper_crawler';

export enum CrawlerType {
    HuggingFace,
}

export class CrawlerHost {
    public static getHost() {
        return new CrawlerHost();
    }

    private crawlers: Map<CrawlerType, ICrawler> = new Map();

    public constructor() {
        this.crawlers.set(CrawlerType.HuggingFace, new HuggingFaceCrawler());
    }

    public get(type: CrawlerType): ICrawler | undefined {
        return this.crawlers.get(type);
    }
}
