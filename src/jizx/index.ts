import { arr } from './util';

export { jsxDEV, Fragment } from './jsx-dev-runtime';

const _contexts: Record<symbol, NonNullable<unknown> | null> = {};

export const renderJizx = (element: JSX.Element): string => {
    if (typeof element === 'undefined' || typeof element === 'boolean') return '';

    if (typeof element === 'string') return element;

    let contextId: symbol | null = null;
    let oldContext: NonNullable<unknown> | null = null;
    if (element.component === 'Provider') {
        const provider = element.render();
        if (typeof provider === 'object' && provider.context) {
            const [id, value] = provider.context;
            contextId = id;
            oldContext = _contexts[contextId];
            _contexts[contextId] = value;
        }
    }

    if (element.component === 'Fragment' || element.component === 'Provider') {
        try {
            return element.children
                .map((child) => arr(child)?.map(renderJizx).join('') ?? renderJizx(<JSX.Element>child))
                .join('');
        } finally {
            if (contextId) {
                _contexts[contextId] = oldContext;
            }
        }
    }

    return renderJizx(element.render());
};

export type Context<T> = {
    id: symbol;
    defaultValue: T;
    Provider: Jizx.Component<{ value?: T }>;
};
export const createContext = <T extends NonNullable<unknown>>(defaultValue: T): Context<T> => {
    const id = Symbol('context');
    return {
        id,
        defaultValue,
        Provider: ({ value }) => {
            return {
                component: 'Context',
                children: [],
                context: [id, value ?? defaultValue],
                render: () => '',
            };
        },
    };
};

export const useContext = <T>(context: Context<T>): T => (_contexts[context.id] as T) ?? context.defaultValue;
