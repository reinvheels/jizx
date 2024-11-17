import { arr } from './util';

export { jsxDEV, Fragment } from './jsx-dev-runtime';

export const renderJizx = (element: JSX.Element): string => {
    if (typeof element === 'string') return element;

    if (element.component === 'Provider') {
        element.render();
    }

    if (element.component === 'Fragment' || element.component === 'Provider') {
        return element.children
            .map((child) => arr(child)?.map(renderJizx).join('') ?? renderJizx(<JSX.Element>child))
            .join('');
    }

    return renderJizx(element.render());
};

const _contexts: Record<symbol, unknown> = {};

export type Context<T> = {
    id: symbol;
    defaultValue: T;
    Provider: Jizx.FC<{ value?: T }>;
};
export const createContext = <T>(defaultValue: T): Context<T> => {
    const id = Symbol('context');
    return {
        id,
        defaultValue,
        Provider: ({ value }) => {
            _contexts[id] = value;
            return '';
        },
    };
};

export const useContext = <T>(context: Context<T>): T => (_contexts[context.id] as T) ?? context.defaultValue;
