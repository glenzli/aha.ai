import React from 'react';
import { Flex, Tag } from 'antd';
import Icon from '@ant-design/icons';
import {
  HTMLContainer, BaseBoxShapeUtil, TLBaseShape,
  T,
} from 'tldraw';
import { ShapeType } from './shape_type';
import { CrawlerType } from '../crawler';
import { CRAWLER_ICONS } from '../layout/left_panel/craw_panel/crawler_icons';
import './crawler_shape.css';
import { boxShapePropValidators, nativeStylePropDefaults, NativeBoxShapeProps, renderNativeStyleCss } from './native_style';

export interface CrawlerRenderProps {
  type: CrawlerType;
  dateExpr: string,
  keyword?: string;
}

export function CrawlerRender({ type, dateExpr, keyword }: CrawlerRenderProps): React.JSX.Element {
  const { t } = useTranslation();
  return (
    <Flex className="crawler-shape" gap="small" align="center" style={{ height: '100%', width: '100%' }}>
      <Icon component={CRAWLER_ICONS[type]} className="icon" />
      <Flex vertical gap="small">
        <div className="title">{t(`crawler.type.${CrawlerType[type].toLowerCase()}`)}</div>
        <Flex gap="small" align="center">
          <Tag className="tag" color="volcano" variant="solid">{t(`date.${dateExpr}`)}</Tag>
          {
            keyword ? <div>
              <Tag className="tag" color="green" variant="solid">{keyword}</Tag>
            </div> : null
          }
        </Flex>
      </Flex>
    </Flex>
  );
};

export interface CrawlerShapeProps extends NativeBoxShapeProps {
  type: CrawlerType;
  dateExpr: string;
  keyword?: string;
}

export type ICrawlerShape = TLBaseShape<
  ShapeType.Crawler,
  CrawlerShapeProps
>;

const BORDER_RADIUS = 12;
const DEFAULT_INIT_SIZE = 10;
export class CrawlerShapeUtil extends BaseBoxShapeUtil<any> {
  static override type = ShapeType.Crawler as const;

  static override props = {
    ...boxShapePropValidators(),
    type: T.literalEnum(...Object.values(CrawlerType)),
    dateExpr: T.string.optional(),
    keyword: T.string.optional(),
  };

  override getDefaultProps(): CrawlerShapeProps {
    return {
      w: DEFAULT_INIT_SIZE,
      h: DEFAULT_INIT_SIZE,
      dateExpr: 'today',
      ...nativeStylePropDefaults(),
      type: CrawlerType.HuggingFace,
    };
  }

  override component(shape: ICrawlerShape) {
    const { w, h, type, dateExpr, keyword } = shape.props;
    const contentRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
      if (contentRef.current) {
        const { offsetWidth, offsetHeight } = contentRef.current

        // 只有当当前存储的尺寸与测量尺寸不符时才更新（通常只在生成瞬间执行一次）
        if (Math.abs(offsetWidth - shape.props.w) > 1 || Math.abs(offsetHeight - shape.props.h) > 1) {
          this.editor.updateShape({
            id: shape.id,
            type: shape.type as any,
            props: { w: offsetWidth, h: offsetHeight },
          })
        }

      }
    }, [shape.props.type, shape.props.dateExpr, shape.props.keyword]);

    return (
      <HTMLContainer
        id={shape.id}
        style={{
          width: w,
          height: h,
          borderRadius: BORDER_RADIUS,
          ...renderNativeStyleCss(this.editor, shape.props),
        }}
      >
        <div ref={contentRef} style={{ width: 'max-content' }}>
          <CrawlerRender
            type={type}
            dateExpr={dateExpr}
            keyword={keyword}
          />
        </div>
      </HTMLContainer>
    );
  }

  override indicator(shape: ICrawlerShape) {
    const { w, h } = shape.props;
    return <rect width={w} height={h} rx={BORDER_RADIUS} ry={BORDER_RADIUS} />;
  }
}


