import {
    DefaultColorStyle, DefaultDashStyle, DefaultFillStyle,
    DefaultSizeStyle, Editor, getDefaultColorTheme,
    TLDefaultColorStyle, TLDefaultDashStyle, TLDefaultFillStyle,
    TLDefaultSizeStyle, T,
    TLDefaultColorThemeColor,
} from "tldraw";

export interface NativeStyleProps {
    color: TLDefaultColorStyle;
    dash: TLDefaultDashStyle;
    fill: TLDefaultFillStyle;
    size: TLDefaultSizeStyle;
}

export function nativeStylePropDefaults(): NativeStyleProps {
    return {
        color: 'black',
        dash: 'solid',
        fill: 'semi',
        size: 's',
    };
}

export function nativeStylePropValidators() {
    return {
        color: DefaultColorStyle,
        dash: DefaultDashStyle,
        fill: DefaultFillStyle,
        size: DefaultSizeStyle,
    };
}

export interface NativeBoxShapeProps extends NativeStyleProps {
    w: number;
    h: number;
}

export function boxShapePropValidators() {
    return {
        w: T.number,
        h: T.number,
        ...nativeStylePropValidators(),
    }
}

export function renderNativeStyleCss(editor: Editor, props: NativeStyleProps): React.CSSProperties {
    const { color, size, dash, fill } = props;
    const isDarkMode = editor.user.getIsDarkMode();
    const theme = getDefaultColorTheme({ isDarkMode });
    const shapeTheme = (theme[color as keyof typeof theme] as TLDefaultColorThemeColor) || theme.black;

    let background = 'transparent';
    if (fill === 'semi') {
        background = isDarkMode ? `rgba(${shapeTheme.solid}, 0.15)` : `rgba(${shapeTheme.solid}, 0.08)`;
    } else if (fill === 'solid') {
        background = shapeTheme.solid;
    }
    const strokeWidth = { s: 2, m: 3, l: 5, xl: 8 }[size as 's' | 'm' | 'l' | 'xl'] || 2;

    return {
        background,
        border: `${strokeWidth}px ${dash !== 'dashed' ? 'solid' : 'dashed'} ${shapeTheme.solid}`,
        color: theme.text,
        fontFamily: 'Yozai, sans-serif',
        fontSize: '14px',
    }
}
