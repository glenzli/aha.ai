import { Button, Space } from 'antd';
import './crawl_panel.css';
import Icon, { FunctionOutlined } from '@ant-design/icons';
import { CrawlerHost, CrawlerType, IDateRange } from '../../../crawler';
import { createShapeId, Editor, TLShapeId } from 'tldraw';
import { autoLayout, arrowTo, ShapeType } from '../../../canvas';
import { CreateCrawlModal } from './create_crawl_modal';
import { CRAWLER_ICONS } from './crawler_icons';
import { compileDateExpr } from '../../../canvas/data_expr/date_expr';
import { DUMMY_SEEDS } from './dummy_abstracts';

const SPACE_WIDTH = 30;
const LONG_SPACE_WIDTH = 80;
export interface CrawlPanelProps {
    editor: Editor | null;
}

export function CrawlPanel({ editor }: CrawlPanelProps): React.JSX.Element {
    const { t } = useTranslation();
    const [type, setType] = useState<CrawlerType>();

    const crawl = async (type: CrawlerType, range?: IDateRange, keyword?: string) => {
        const crawler = CrawlerHost.getHost().get(type);
        if (!crawler) return;
        const abstracts = await (keyword ? crawler.search(keyword, range) : crawler.daily(range));
        return abstracts;
    };

    const insertShape = async (type?: CrawlerType, range?: IDateRange, keyword?: string) => {
        if (!editor || type === undefined) return;
        const shapeId = createShapeId();
        const { center } = editor.getViewportPageBounds();
        editor.createShape<any>({
            id: shapeId,
            type: ShapeType.Crawler as const,
            x: center.x,
            y: center.y,
            props: {
                type,
                loading: true,
                dateExpr: compileDateExpr(range),
                keyword,
            },
        });
        requestAnimationFrame(() => {
            const offsetX = center.x + (editor.getShapePageBounds(shapeId)?.width ?? 0) + LONG_SPACE_WIDTH;
            insertSeeds(shapeId, offsetX);
        });
    };

    const insertSeeds = async (crawerId: TLShapeId, offsetX: number) => {
        if (!editor) return;
        // const abstracts = await crawl(type, range, keyword);
        const seeds = DUMMY_SEEDS;
        editor.updateShape<any>({
            id: crawerId,
            type: ShapeType.Crawler as const,
            props: {
                loading: false,
            },
        });
        if (!seeds) return;
        const shapeIds = seeds.map(() => createShapeId());
        editor.createShapes<any>(shapeIds.map((id, index) => ({
            id,
            type: ShapeType.Seed as const,
            props: {
                seed: seeds[index],
            },
            x: offsetX,
        })));
        requestAnimationFrame(() => {
            editor.stackShapes(shapeIds, 'vertical', SPACE_WIDTH);
            shapeIds.forEach((id) => {
                arrowTo(editor, crawerId, id);
            });
            autoLayout(editor);
        });
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
