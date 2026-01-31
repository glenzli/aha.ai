import { Badge, Flex, Tag } from "antd";
import { IContextSeed } from "src/crawler";
import { ShapeStyleProps } from "./shape_style";
import { TLBaseShape, T } from "tldraw";
import { ShapeType } from "./shape_type";
import { DynamicSizeShape } from "./dynamic_size_shape";
import "./seed_shape.css";
import React from "react";

export interface SeedShapeProps extends ShapeStyleProps {
    seed: IContextSeed;
    brief?: boolean;
    deactive?: boolean;
}

export type ISeedShape = TLBaseShape<ShapeType.Seed, SeedShapeProps>;

export class SeedShapeUtil extends DynamicSizeShape<ISeedShape> {
    static override type = ShapeType.Seed as const;

    static override props = {
        ...DynamicSizeShape.props,
        seed: T.object({
            title: T.string,
            authors: T.arrayOf(T.string),
            organization: T.string.optional(),
            publishedAt: T.string,
            summary: T.string,
            url: T.string,
            likes: T.number.optional(),
            hot: T.boolean.optional(),
        }),
        brief: T.boolean.optional(),
        deactive: T.boolean.optional(),
    };

    public override getDefaultProps(): SeedShapeProps {
        return {
            ...super.getDefaultProps(),
            seed: {
                title: "",
                authors: [],
                publishedAt: "",
                summary: "",
                url: "",
            },
        };
    }

    public override getSizeDeps(shape: ISeedShape): any[] {
        return [shape.props.seed.title, shape.props.seed.organization];
    }

    public override contentComponent(shape: ISeedShape): React.JSX.Element {
        const { seed } = shape.props;
        return <div className="seed-shape" style={{ opacity: shape.props.deactive ? 0.25 : 1 }}>
            <Flex gap="small" align="center">
                <Badge count={seed.likes} color={seed.hot ? 'red' : 'gray'}>
                    {seed.organization && <Tag color="blue" variant="solid">{seed.organization}</Tag>}
                </Badge>
                <div className="title">{seed.title}</div>
            </Flex>
            {!shape.props.brief && <React.Fragment>
                <div className="summary">{seed.summary}</div>
                <Flex gap="small" align="center" justify="flex-end">
                    {seed.authors.map((author) => (<Tag color="green">{author}</Tag>))}
                </Flex>
            </React.Fragment>}
        </div>;
    }
}
