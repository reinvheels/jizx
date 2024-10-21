import type { Jizx } from './jsx-dev-runtime';
import { arr } from './util';

export { type Jizx, jsxDEV, Fragment } from './jsx-dev-runtime';

export declare namespace JSX {
    type Element = string | Jizx.VirtualComponent;
}

export const renderJizx = (element: JSX.Element): string => {
    if (typeof element === 'string') return element;

    if (element.component === 'Fragment') {
        return element.children
            .map((child) => arr(child)?.map(renderJizx).join('') ?? renderJizx(<JSX.Element>child))
            .join('');
    }

    return renderJizx(element.rendered);
};
