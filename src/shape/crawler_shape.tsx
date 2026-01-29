import React from 'react';
import { Flex } from 'antd';
import Icon from '@ant-design/icons';
import { IDateRange } from '../crawler/crawler.interface';
import {
  HTMLContainer, BaseBoxShapeUtil, TLBaseShape,
} from 'tldraw';
import { ShapeType } from './shape_type';
import { CrawlerType } from '../crawler';
import { CRAWLER_ICONS } from '../layout/left_panel/craw_panel/crawler_icons';
import './crawler_shape.css';

export interface CrawlerRenderProps {
  type: CrawlerType;
  range?: IDateRange;
  keyword?: string;
}

export function CrawlerRender({ type, range, keyword }: CrawlerRenderProps): React.JSX.Element {
  const shortStr = (date: Date) => date.toISOString().substring(2, 10).replaceAll('-', '/');
  const { t } = useTranslation();

  let dateStr = '';
  if (!range || !range.start) {
    dateStr = shortStr(new Date());
  } else if (!range.end) {
    dateStr = shortStr(range.start);
  } else {
    dateStr = `${shortStr(range.start)}-${shortStr(range.end)}`;
  }
  return (
    <Flex className="crawler-shape" vertical gap="small" style={{ height: '100%', width: '100%' }}>
      <Flex gap="small" align="center">
        <Icon component={CRAWLER_ICONS[type]} className="icon" />
        <span className="title">{t(`crawler.type.${CrawlerType[type].toLowerCase()}`)}</span>
      </Flex>
      <div>{dateStr}</div>
      <div>{keyword || ''}</div>
    </Flex>
  );
};

export interface CrawlerShapeProps {
  w: number;
  h: number;
  type: CrawlerType;
  range: { start?: number; end?: number } | null;
  keyword: string;
}

export type ICrawlerShape = TLBaseShape<
  ShapeType.Crawler,
  CrawlerShapeProps
>;

export class CrawlerShapeUtil extends BaseBoxShapeUtil<any> {
  static override type = ShapeType.Crawler as const;

  override getDefaultProps(): CrawlerShapeProps {
    return {
      w: 200,
      h: 100,
      type: CrawlerType.HuggingFace,
      range: null,
      keyword: '',
    };
  }

  override component(shape: ICrawlerShape) {
    let dateRange: IDateRange | undefined = undefined;
    if (shape.props.range) {
      dateRange = {};
      if (shape.props.range.start !== undefined) {
        dateRange.start = new Date(shape.props.range.start);
      }
      if (shape.props.range.end !== undefined) {
        dateRange.end = new Date(shape.props.range.end);
      }
    }
    return (
      <HTMLContainer
        id={shape.id}
        style={{
          width: shape.props.w,
          height: shape.props.h,
        }}
      >
        <CrawlerRender
          type={shape.props.type}
          range={dateRange}
          keyword={shape.props.keyword}
        />
      </HTMLContainer>
    );
  }

  override indicator(shape: ICrawlerShape) {
    return <rect width={shape.props.w} height={shape.props.h} rx={12} ry={12} />;
  }
}


