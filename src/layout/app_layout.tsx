import React, { useState } from 'react';
import { Splitter } from 'antd';
import { TitleBar } from './title_bar';
import { LeftPanel } from './left_panel';

interface BodyProps {
  contentPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
}

const TITLE_BAR_HEIGHT = 32;
const STATUS_BAR_HEIGHT = 24;

const MIN_LEFT_PANEL_WIDTH = 240;
const MIN_RIGHT_PANEL_WIDTH = 300;

export function AppLayout({
  contentPanel,
  rightPanel,
}: BodyProps = {}): React.JSX.Element {
  const [leftWidth, setLeftWidth] = useState<number>(MIN_LEFT_PANEL_WIDTH);

  const [rightWidth, setRightWidth] = useState<number>(MIN_RIGHT_PANEL_WIDTH);

  const onResize = (sizes: number[]) => {
    if (sizes[0] !== undefined) {
      setLeftWidth(sizes[0]);
    }
    if (sizes[2] !== undefined) {
      setRightWidth(sizes[2]);
    }
  };

  return <Splitter style={{ height: '100%', width: '100%' }} orientation="vertical">
    <Splitter.Panel defaultSize={TITLE_BAR_HEIGHT} resizable={false} collapsible={false}>
      <TitleBar />
    </Splitter.Panel>
    <Splitter.Panel>
      <Splitter onResize={onResize}>
        <Splitter.Panel size={leftWidth} min={MIN_LEFT_PANEL_WIDTH}>
          <LeftPanel />
        </Splitter.Panel>
        <Splitter.Panel>
          {contentPanel}
        </Splitter.Panel>
        <Splitter.Panel size={rightWidth} min={MIN_RIGHT_PANEL_WIDTH}>
          {rightPanel}
        </Splitter.Panel>
      </Splitter>
    </Splitter.Panel>
    <Splitter.Panel defaultSize={STATUS_BAR_HEIGHT} resizable={false} collapsible={false}></Splitter.Panel>
  </Splitter>;
};
