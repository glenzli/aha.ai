import {
    Editor, TLShapeId, createShapeId,
    Vec, Box, createBindingId,
} from 'tldraw'

/**
 * 自动寻找两个矩形之间距离最近的四个边缘中点 (Top, Bottom, Left, Right)
 */
const getOptimalAnchor = (from: Box, to: Box) => {
    const dx = to.center.x - from.center.x
    const dy = to.center.y - from.center.y

    // 根据 X 和 Y 的位移量判断主要方向
    if (Math.abs(dx) > Math.abs(dy)) {
        // 目标在左右方向：返回左中点(0, 0.5) 或 右中点(1, 0.5)
        return { x: dx > 0 ? 1 : 0, y: 0.5 }
    } else {
        // 目标在上下方向：返回上中点(0.5, 0) 或 下中点(0.5, 1)
        return { x: 0.5, y: dy > 0 ? 1 : 0 }
    }
}

export const arrowTo = (editor: Editor, sourceId: TLShapeId, targetId: TLShapeId) => {
    // 使用 rAF 确保动态高度节点的 props.h 已被 ResizeObserver 更新
    requestAnimationFrame(() => {
        const sourceBounds = editor.getShapePageBounds(sourceId)
        const targetBounds = editor.getShapePageBounds(targetId)

        if (!sourceBounds || !targetBounds) return

        // 1. 计算最佳锚点（避免所有线都挤在 0.5, 0.5 中心点）
        const startAnchor = getOptimalAnchor(sourceBounds, targetBounds)
        const endAnchor = getOptimalAnchor(targetBounds, sourceBounds)

        // 2. 计算基于锚点的绝对坐标，用于初始化箭头位置
        const startPoint = {
            x: sourceBounds.minX + sourceBounds.width * startAnchor.x,
            y: sourceBounds.minY + sourceBounds.height * startAnchor.y,
        }
        const endPoint = {
            x: targetBounds.minX + targetBounds.width * endAnchor.x,
            y: targetBounds.minY + targetBounds.height * endAnchor.y,
        }

        const arrowId = createShapeId()
        const delta = Vec.Sub(endPoint, startPoint)

        // 3. 创建箭头形状 (纯坐标模式)
        editor.createShape({
            id: arrowId,
            type: 'arrow',
            x: startPoint.x,
            y: startPoint.y,
            props: {
                start: { x: 0, y: 0 },
                end: { x: delta.x, y: delta.y },
                color: 'black',
                dash: 'draw',
                size: 'm',
                // 关键：增加轻微弧度，有效减少连线直接穿过图形的情况
                bend: 40,
            },
        })

        // 4. 创建绑定关系 (强制触发边缘吸附)
        // 起点绑定
        editor.createBinding({
            id: createBindingId(),
            type: 'arrow',
            fromId: arrowId,
            toId: sourceId,
            props: {
                terminal: 'start',
                normalizedAnchor: startAnchor,
                isPrecise: false, // 设为 false，tldraw 会自动计算与 indicator 边缘的交点
            },
        })

        // 终点绑定
        editor.createBinding({
            id: createBindingId(),
            type: 'arrow',
            fromId: arrowId,
            toId: targetId,
            props: {
                terminal: 'end',
                normalizedAnchor: endAnchor,
                isPrecise: false,
            },
        })
    })
}
