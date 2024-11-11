import { arr, str } from './util';
import { JSX as JSXHtml } from './jsx';

declare global {
    namespace Jizx {
        type FC<TProps> = (props: TProps & { children?: Child | Child[] }) => JSX.Element;
        type VirtualComponent = {
            component: string;
            children: (Child | Child[])[];
            rendered: JSX.Element;
        };
        type Child = JSX.Element;
    }

    export import JSX = JSXHtml;
}

export const Fragment = () => 'FRAGMENT';

export const jsxDEV = <TProps>(
    component: string | Jizx.FC<TProps>,
    { children, ...props }: { children?: Jizx.Child | Jizx.Child[] } & TProps,
): JSX.Element => {
    const _children: JSX.Element[] = (arr(children) ?? [<Jizx.Child>children]).filter(Boolean).map((child) =>
        str(child)
            ? {
                  children: [],
                  component: 'string',
                  rendered: child,
              }
            : child,
    );
    if (typeof component === 'string') {
        const hasChildren = _children.length > 0;
        return {
            component: 'Fragment',
            children: hasChildren
                ? [renderHtmlOpeningTag(component, props), ..._children, renderHtmlClosingTag(component)]
                : [renderHtmlOpeningTag(component, props, true)],
            rendered: 'HTML',
        };
    }
    return {
        component: component.name,
        children: _children,
        rendered: component({
            children: _children,
            ...(<TProps>props),
        }),
    };
};

const renderHtmlOpeningTag = (component: string, props: Record<string, unknown>, close = false) => ({
    component,
    children: [],
    rendered: `<${component}${Object.keys(props)
        .map((attribute) => {
            const value = props[attribute];
            if (typeof value === 'boolean') {
                return value ? ` ${attribute}` : '';
            }
            return ` ${attribute}="${props[attribute]}"`;
        })
        .join('')}${close ? ' /' : ''}>`,
});
const renderHtmlClosingTag = (component: string) => ({
    component,
    children: [],
    rendered: `</${component}>`,
});
