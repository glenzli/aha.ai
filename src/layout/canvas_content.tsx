import { getAssetUrls } from "@tldraw/assets/selfHosted";
import { CUSTOM_SHAPES } from "../canvas";
import { Editor, Tldraw } from "tldraw";

export interface CanvasContentProps {
    onMount: (editor: Editor) => void;
}

export const CanvasContent = memo(({ onMount }: CanvasContentProps) => {
    const assetUrls = getAssetUrls({ baseUrl: './tldraw-assets' });

    return (<Tldraw
        assetUrls={assetUrls}
        components={{
            Toolbar: null,
            StylePanel: null,
        }}
        shapeUtils={CUSTOM_SHAPES}
        onMount={onMount}
    />);
});
