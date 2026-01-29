import { DeploymentUnitOutlined, GlobalOutlined } from "@ant-design/icons";
import { ConfigProvider, Tabs } from "antd";
import './left_panel.css';
import { CrawlPanel } from "./craw_panel";
import { Editor } from "tldraw";

enum LeftPanelTab {
    KnowledgeBase = 'KnowledgeBase',
    Crawl = 'Crawl',
}

export interface LeftPanelProps {
    editor: Editor | null;
}

export function LeftPanel({ editor }: LeftPanelProps): React.JSX.Element {
    return <ConfigProvider theme={{
        components: {
            Tabs: {
                verticalItemPadding: '10px 4px 10px 10px',
                verticalItemMargin: '0px',
            },
        },
    }}>
        <Tabs className="left-panel" tabPlacement="start" items={[
            {
                key: LeftPanelTab.KnowledgeBase,
                label: '',
                icon: <DeploymentUnitOutlined className="tabicon" />,
            },
            {
                key: LeftPanelTab.Crawl,
                label: '',
                icon: <GlobalOutlined className="tabicon" />,
                children: <CrawlPanel editor={editor} />,
            }
        ]} />
    </ConfigProvider>;
}