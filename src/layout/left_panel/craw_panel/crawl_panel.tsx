import { Button, Space } from 'antd';
import './crawl_panel.css';
import HuggingFaceSvg from '../../../../resources/huggingface.svg?react';
import Icon, { FunctionOutlined } from '@ant-design/icons';

export function CrawlPanel(): React.JSX.Element {
    const { t } = useTranslation();
    return <div className="crawl-panel">
        <div className="crawl-item">
            <FunctionOutlined className="crawl-icon" />
            {t('paper.daily')}
        </div>
        <Button icon={<Icon component={HuggingFaceSvg} style={{ fontSize: 16 }} />} className="crawl-item" type="text">
            <div className='crawl-button-content'>
                <span>HuggingFace</span>
                <Space/>
            </div>
        </Button>
    </div>;
}
