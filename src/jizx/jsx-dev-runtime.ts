import type { JSX } from '.';
import { arr, str } from './util';

export declare namespace Jizx {
    type FC<TProps> = (props: TProps & { children?: Child[] }) => JSX.Element;
    type VirtualComponent = {
        component: string;
        children: (Child | Child[])[];
        rendered: JSX.Element;
    };
    type Child = JSX.Element;
}

export const Fragment = () => 'FRAGMENT';

export const jsxDEV = <TProps>(
    component: Jizx.FC<TProps>,
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
    return {
        component: component.name,
        children: _children,
        rendered: component({
            children: _children,
            ...(<TProps>props),
        }),
    };
};
