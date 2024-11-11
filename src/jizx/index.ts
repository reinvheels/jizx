import { arr } from './util';

export { jsxDEV, Fragment } from './jsx-dev-runtime';

export const renderJizx = (element: JSX.Element): string => {
    if (typeof element === 'string') return element;

    if (element.component === 'Fragment') {
        return element.children
            .map((child) => arr(child)?.map(renderJizx).join('') ?? renderJizx(<JSX.Element>child))
            .join('');
    }

    return renderJizx(element.rendered);
};
