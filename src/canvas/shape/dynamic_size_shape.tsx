import { BaseBoxShapeUtil, HTMLContainer, TLBaseShape } from "tldraw";
import {
    nativeStylePropDefaults, nativeStylePropValidators, renderShapeStyleCss,
} from "./shape_style";

type ShapePropsOf<S> = S extends TLBaseShape<any, infer P> ? P : never;

export abstract class DynamicSizeShape<S extends TLBaseShape<any, any>> extends BaseBoxShapeUtil<any> {
    public static override props = nativeStylePropValidators();

    protected abstract getSizeDeps(shape: S): any[];
    protected abstract contentComponent(shape: S): React.JSX.Element;

    public override getDefaultProps(): ShapePropsOf<S> {
        return nativeStylePropDefaults() as ShapePropsOf<S>;
    }

    public override component(shape: S) {
        const { w, h } = shape.props;
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
        }, this.getSizeDeps(shape));

        return (
            <HTMLContainer
                id={shape.id}
                style={{
                    width: w,
                    height: h,
                    ...renderShapeStyleCss(this.editor, shape.props),
                }}
            >
                <div ref={contentRef} style={{ width: 'max-content' }}>
                    {this.contentComponent(shape)}
                </div>
            </HTMLContainer>
        );
    }

    public override indicator(shape: S) {
        const { w, h } = shape.props;
        return <rect width={w} height={h} />;
    }

    public override canResize() {
        return false;
    }
}
