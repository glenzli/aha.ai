import { Button, Space } from 'antd';
import './crawl_panel.css';
import Icon, { FunctionOutlined } from '@ant-design/icons';
import { CrawlerHost, CrawlerType, IDateRange } from '../../../crawler';
import { Editor } from 'tldraw';
import { ShapeType } from '../../../shape';
import { CreateCrawlModal } from './create_crawl_modal';
import { CRAWLER_ICONS } from './crawler_icons';

export interface CrawlPanelProps {
    editor: Editor | null;
}

export function CrawlPanel({ editor }: CrawlPanelProps): React.JSX.Element {
    const { t } = useTranslation();
    const [type, setType] = useState<CrawlerType>();

    const crawl = async (type: CrawlerType) => {
        const crawler = CrawlerHost.getHost().get(type);
        if (!crawler) return;
        const abstracts = await crawler.daily();
        return abstracts;
    };

    const insertShape = (type?: CrawlerType, range?: IDateRange, keyword?: string) => {
        if (!editor || type === undefined) return;
        editor.createShape<any>({
            type: ShapeType.Crawler as const,
            props: {
                type,
                range: range ? {
                    start: range.start?.getTime(),
                    end: range.end?.getTime(),
                } : null,
                keyword: keyword || '',
            }
        })
    };

    return <div className="crawl-panel">
        <CreateCrawlModal
            type={type}
            onOk={(range, keyword) => {
                insertShape(type, range, keyword);
                setType(undefined);
            }}
            onCancel={() => setType(undefined)}
        />
        <div className="crawl-item">
            <FunctionOutlined className="crawl-icon" />
            {t('paper.daily')}
        </div>
        <Button
            icon={<Icon component={CRAWLER_ICONS[CrawlerType.HuggingFace]} style={{ fontSize: 16 }} />}
            className="crawl-item"
            type="text"
            onClick={() => setType(CrawlerType.HuggingFace)}
        >
            <div className='crawl-button-content'>
                <span>{t('crawler.type.huggingface')}</span>
                <Space />
            </div>
        </Button>
    </div>;
}
