import {
    DefaultSizeStyle, Editor, getDefaultColorTheme,
    TLDefaultDashStyle, DefaultDashStyle, TLDefaultSizeStyle,
    T,
} from "tldraw";

const INIT_SIZE = 10;

export interface ShapeStyleProps {
    w: number;
    h: number;
    dash: TLDefaultDashStyle;
    size: TLDefaultSizeStyle;
}

export function nativeStylePropDefaults(): ShapeStyleProps {
    return {
        dash: 'solid',
        size: 's',
        w: INIT_SIZE,
        h: INIT_SIZE,
    };
}

export function nativeStylePropValidators() {
    return {
        dash: DefaultDashStyle,
        size: DefaultSizeStyle,
        w: T.number,
        h: T.number,
    };
}

export function renderShapeStyleCss(editor: Editor, props: ShapeStyleProps): React.CSSProperties {
    const { size, dash } = props;
    const theme = getDefaultColorTheme({ isDarkMode: editor.user.getIsDarkMode() });
    const strokeWidth = { s: 2, m: 3, l: 5, xl: 8 }[size as 's' | 'm' | 'l' | 'xl'] || 2;

    return {
        background: theme.white.solid,
        border: `${strokeWidth}px ${dash !== 'dashed' ? 'solid' : 'dashed'} ${theme.black.solid}`,
        color: theme.text,
        fontFamily: 'Yozai, sans-serif',
        fontSize: '14px',
    }
}
