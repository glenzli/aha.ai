import React from 'react';
import { Flex, Tag } from 'antd';
import Icon, { CheckOutlined, LoadingOutlined } from '@ant-design/icons';
import {
  TLBaseShape,
  T,
} from 'tldraw';
import { ShapeType } from './shape_type';
import { CrawlerType } from '../../crawler';
import { CRAWLER_ICONS } from '../../layout/left_panel/craw_panel/crawler_icons';
import './crawler_shape.css';
import { ShapeStyleProps } from './shape_style';
import { DynamicSizeShape } from './dynamic_size_shape';

export interface CrawlerShapeProps extends ShapeStyleProps {
  type: CrawlerType;
  loading: boolean;
  dateExpr: string,
  keyword?: string;
}

export type ICrawlerShape = TLBaseShape<ShapeType.Crawler, CrawlerShapeProps>;

export class CrawlerShapeUtil extends DynamicSizeShape<ICrawlerShape> {
  static override type = ShapeType.Crawler as const;

  static override props = {
    ...DynamicSizeShape.props,
    type: T.literalEnum(...Object.values(CrawlerType)),
    loading: T.boolean,
    dateExpr: T.string.optional(),
    keyword: T.string.optional(),
  };

  public override getDefaultProps(): CrawlerShapeProps {
    return {
      ...super.getDefaultProps(),
      loading: true,
      dateExpr: 'today',
      type: CrawlerType.HuggingFace,
    };
  }

  protected override getSizeDeps(shape: ICrawlerShape): any[] {
    return [shape.props.type, shape.props.dateExpr, shape.props.keyword];
  }

  protected contentComponent(shape: ICrawlerShape): React.JSX.Element {
    const { type, loading, dateExpr, keyword } = shape.props;
    const { t } = useTranslation();
    return (
      <Flex className="crawler-shape" gap="small" align="center">
        <Icon component={CRAWLER_ICONS[type]} className="icon" />
        <div className="title">{t(`crawler.type.${CrawlerType[type].toLowerCase()}`)}</div>
        {loading ? <LoadingOutlined className="icon" /> : <CheckOutlined className="icon" />}
        <Tag className="tag" color="volcano" variant="solid">{t(`date.${dateExpr}`)}</Tag>
        <Tag className="tag" color="green" variant="solid">{keyword || t('crawler.all')}</Tag>
      </Flex>
    );
  }
}


