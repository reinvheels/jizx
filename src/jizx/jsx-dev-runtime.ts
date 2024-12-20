import { arr, str } from './util';
import { JSX as JSXHtml } from './jsx';

declare global {
    namespace Jizx {
        type Component<TProps> = (props: TProps & { children?: Child | Child[] }) => JSX.Element;
        type VirtualComponent = {
            component: string;
            context?: [symbol, NonNullable<unknown>];
            children: (Child | Child[])[];
            render: () => JSX.Element;
        };
        type Child = JSX.Element;
    }

    export import JSX = JSXHtml;
}

export const Fragment = () => 'FRAGMENT';

export const jsxDEV = <TProps>(
    component: string | Jizx.Component<TProps>,
    { children, ...props }: { children?: Jizx.Child | Jizx.Child[] } & TProps,
): JSX.Element => {
    const _children: JSX.Element[] = (arr(children) ?? [<Jizx.Child>children]).filter(Boolean).map((child) =>
        str(child)
            ? {
                  children: [],
                  component: 'string',
                  render: () => child,
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
            render: () => 'HTML',
        };
    }
    return {
        component: component.name,
        children: _children,
        render: () =>
            component({
                children: _children,
                ...(<TProps>props),
            }),
    };
};

const renderHtmlOpeningTag = (component: string, props: Record<string, unknown>, close = false): JSX.Element => ({
    component,
    children: [],
    render: () =>
        `<${component}${Object.keys(props)
            .map((attribute) => {
                const value = props[attribute];
                if (typeof value === 'boolean') {
                    return value ? ` ${attribute}` : '';
                }
                return ` ${attribute}="${props[attribute]}"`;
            })
            .join('')}${close ? ' /' : ''}>`,
});
const renderHtmlClosingTag = (component: string): JSX.Element => ({
    component,
    children: [],
    render: () => `</${component}>`,
});
