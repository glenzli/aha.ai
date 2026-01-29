import { DatePicker, Flex, Input, Modal } from "antd";
import { CrawlerType, IDateRange } from "../../../crawler";
import dayjs from 'dayjs';
import Icon from "@ant-design/icons";
import { CRAWLER_ICONS } from "./crawler_icons";

export interface CreateCrawlModalProps {
    type?: CrawlerType,
    onOk: (range?: IDateRange, keyword?: string) => void,
    onCancel: () => void,
}

export function CreateCrawlModal({ type, onOk, onCancel }: CreateCrawlModalProps): React.JSX.Element {
    const { t } = useTranslation();

    const [range, setRange] = useState<IDateRange>({ start: new Date(), end: new Date() });
    const [keyword, setKeyword] = useState<string>('');

    const onRangeChange = (values: any) => {
        if (!values) {
            setRange({ start: new Date(), end: new Date() });
            return;
        }

        setRange({
            start: values[0]?.toDate(),
            end: values[1]?.toDate(),
        });
    };

    return (
        <Modal
            title={
                type !== undefined
                    ? <Flex gap="small">
                        <Icon component={CRAWLER_ICONS[type]} />
                        {t(`crawler.type.${CrawlerType[type].toLowerCase()}`)}
                    </Flex>
                    : ''
            }
            open={type !== undefined}
            onOk={() => onOk(range, keyword || undefined)}
            onCancel={onCancel}
        >
            <Flex vertical gap="small">
                <DatePicker.RangePicker
                    size='small'
                    value={range?.start && range.end ? [dayjs(range.start), dayjs(range.end)] : null}
                    onChange={onRangeChange}
                />
                <Input
                    size="small"
                    placeholder="Enter keyword..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
            </Flex>
        </Modal>
    );
}
