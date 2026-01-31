import { createShapeId, Editor } from "tldraw";
import { ShapeType } from "../shape/shape_type";
import { CrawlerType, IDateRange } from "src/crawler";
import { compileDateExpr } from "../data_expr";

function createCrawlerShape(editor: Editor, type: CrawlerType, range?: IDateRange, keyword?: string) {
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
        insertAbstracts(shapeId, offsetX);
    });
}