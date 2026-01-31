import { Graph } from '@antv/graphlib';
import { DagreLayout } from '@antv/layout';
import { Editor, TLBaseShape, TLBinding, TLShapeId } from 'tldraw';

export async function autoLayout(editor: Editor) {
    const g = new Graph<any, any>();
    const currentPageId = editor.getCurrentPageId();
    const allRecords = editor.store.allRecords();
    
    const crawlerShapes = allRecords.filter(r => 
        r.typeName === 'shape' && r.parentId === currentPageId && r.type !== 'arrow'
    ) as any[];

    const allBindings = allRecords.filter(r => r.typeName === 'binding') as any[];

    if (crawlerShapes.length === 0) return;

    // 1. 注册节点：确保 width/height 位于 data 根部
    crawlerShapes.forEach(s => {
        const bounds = editor.getShapePageBounds(s.id)!;
        g.addNode({
            id: s.id,
            data: {
                // 增加保底尺寸，防止 0 导致重叠
                width: Math.max(bounds.width, 50),
                height: Math.max(bounds.height, 20),
            }
        });
    });

    // 2. 注册连线 (同前...)
    const arrowMap = new Map<string, { start?: string; end?: string }>();
    allBindings.forEach(b => {
        const link = arrowMap.get(b.fromId) || {};
        if (b.props?.terminal === 'start') link.start = b.toId;
        if (b.props?.terminal === 'end') link.end = b.toId;
        arrowMap.set(b.fromId, link);
    });
    arrowMap.forEach((l, arrowId) => {
        if (l.start && l.end && g.hasNode(l.start) && g.hasNode(l.end)) {
            g.addEdge({ id: `e-${arrowId}`, source: l.start, target: l.end, data: {} });
        }
    });

    // 3. 核心修正：v1.x Beta 的布局配置
    const dagre = new DagreLayout({
        // 增加间距以应对动态高度
        nodesep: 120, // 水平间距
        ranksep: 150, // 垂直层级间距（调大这个值可以明显减少重叠）
        align: 'DL',  // 尝试使用不同的对齐策略：UL, UR, DL, DR
        rankdir: 'TB',
        // 关键：确保算法知道节点的大小
        nodeSize: (d: any) => [d.data.width, d.data.height],
        // 强制开启禁止重叠的逻辑 (如果版本支持)
        controlPoints: true,
    } as any);

    // 4. 执行布局
    await dagre.execute(g);

    // 5. 提取坐标并处理 offset
    const updates = crawlerShapes.map((shape) => {
        const node = g.getNode(shape.id);
        const layoutData = node.data;

        // v1.x Beta 坐标可能在 data 下或 data.layout 下
        const finalX = layoutData.x ?? layoutData.layout?.x;
        const finalY = layoutData.y ?? layoutData.layout?.y;

        if (finalX === undefined || isNaN(finalX)) return null;

        return {
            id: shape.id as TLShapeId,
            type: shape.type,
            // 务必减去计算时的 width/height 的一半，回归 tldraw 左上角坐标
            x: finalX - (layoutData.width / 2),
            y: finalY - (layoutData.height / 2),
        };
    }).filter(Boolean);

    if (updates.length > 0) {
        editor.updateShapes(updates as any[]);
        editor.zoomToFit({ animation: { duration: 500 } });
    }
}
