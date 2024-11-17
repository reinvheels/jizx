import { expect, test } from 'bun:test';
import { createContext, renderJizx, useContext } from 'jizx';

test('render string', () => {
    const result = renderJizx('Hello World!');

    expect(result).toBe('Hello World!');
});

test('render string body', () => {
    const Component: Jizx.FC<{ message: string }> = ({ message }) => message;

    const result = renderJizx(<Component message="Hello World!" />);

    expect(result).toBe('Hello World!');
});

test('render Fragment single nested', () => {
    const Component: Jizx.FC<{}> = ({}) => <>{'Hello World!'}</>;

    const result = renderJizx(<Component />);

    expect(result).toBe('Hello World!');
});

test('render Fragment multiple nested', () => {
    const Component: Jizx.FC<{}> = ({}) => (
        <>
            {'First'} {'Second'}
        </>
    );

    const result = renderJizx(<Component />);

    expect(result).toBe('First Second');
});

test('render custom single nested', () => {
    const Child: Jizx.FC<{}> = ({}) => <>{'String Child'}</>;
    const Component: Jizx.FC<{}> = ({}) => <Child />;

    const result = renderJizx(<Component />);

    expect(result).toBe('String Child');
});

test('render custom multiple nested', () => {
    const Child: Jizx.FC<{}> = ({}) => (
        <>
            {'First'} {'Second'}
        </>
    );
    const Component: Jizx.FC<{}> = ({}) => <Child />;

    const result = renderJizx(<Component />);

    expect(result).toBe('First Second');
});

test('render children', () => {
    const Child: Jizx.FC<{}> = ({}) => <>{'Child'}</>;
    const Component: Jizx.FC<{}> = ({ children }) => <>{children}</>;

    const result = renderJizx(
        <Component>
            <Child />
            <Child />
        </Component>,
    );

    expect(result).toBe('ChildChild');
});

test("don't render children", () => {
    const Child: Jizx.FC<{}> = ({}) => <>{'Child'}</>;
    const Component: Jizx.FC<{}> = ({}) => <>{'No children'}</>;

    const result = renderJizx(
        <Component>
            <Child />
            <Child />
        </Component>,
    );

    expect(result).toBe('No children');
});

test('render complex page', () => {
    const Item: Jizx.FC<{ name: string }> = ({ name }) => (
        <>
            {'Item'} {name}
        </>
    );
    const Container: Jizx.FC<{ title: string }> = ({ title, children }) => (
        <>
            {'Title:'} {title}
            {'Children:'} {children}
        </>
    );

    const result = (
        <Container title="My Container">
            <>
                <Item name="1" />
                <Item name="2" />
                <Item name="3" />
            </>
            <Item name="4" />
        </Container>
    );

    expect(renderJizx(result)).toBe('Title: My ContainerChildren: Item 1Item 2Item 3Item 4');
});

test('render html', () => {
    const result = <h1>{'String Child'}</h1>;

    expect(renderJizx(result)).toBe('<h1>String Child</h1>');
});

test('render html without children', () => {
    const result = <br></br>;

    expect(renderJizx(result)).toBe('<br />');
});

test('render html string attributes', () => {
    const result = (
        <h1 id="some-child" class="some classes">
            {'Header'}
        </h1>
    );

    expect(renderJizx(result)).toBe('<h1 id="some-child" class="some classes">Header</h1>');
});

test('render html number attributes', () => {
    const result = <img width={500}></img>;

    expect(renderJizx(result)).toBe('<img width="500" />');
});

test('render html true attributes', () => {
    const result = <input type="checkbox" checked></input>;

    expect(renderJizx(result)).toBe('<input type="checkbox" checked />');
});

test('render html false attributes', () => {
    const result = <input type="checkbox" checked={false}></input>;

    expect(renderJizx(result)).toBe('<input type="checkbox" />');
});

const TestContext = createContext('Default Value');
test('render default context value', () => {
    const Component = () => {
        const value = useContext(TestContext);
        return <h1>{value}</h1>;
    };

    const result = <Component />;

    expect(renderJizx(result)).toBe('<h1>Default Value</h1>');
});

test('render provided context value', () => {
    const Component: Jizx.FC<{}> = () => {
        const value = useContext(TestContext);
        return <h1>{value}</h1>;
    };

    const result = (
        <TestContext.Provider value="Provided Value">
            <Component />
        </TestContext.Provider>
    );

    expect(renderJizx(result)).toBe('<h1>Provided Value</h1>');
});

const OutOfContext1 = createContext('Not in Context');
test('do not render out of context 1', () => {
    const Component: Jizx.FC<{}> = () => {
        const value = useContext(OutOfContext1);
        return (
            <>
                <h1>{value}</h1>
                <OutOfContext1.Provider value="Provided Value" />
            </>
        );
    };

    expect(renderJizx(<Component />)).toBe('<h1>Not in Context</h1>');
});

const OutOfContext2 = createContext('Not in Context');
test('do not render out of context 2', () => {
    const Component: Jizx.FC<{}> = () => {
        const value = useContext(OutOfContext2);
        return <h1>{value}</h1>;
    };

    expect(
        renderJizx(
            <>
                <Component />
                <OutOfContext2.Provider value="Provided Value" />
            </>,
        ),
    ).toBe('<h1>Not in Context</h1>');
});

const OutOfContext3 = createContext('Not in Context');
test('do not render out of context 3', () => {
    const Component: Jizx.FC<{}> = () => {
        const value = useContext(OutOfContext3);
        return <h1>{value}</h1>;
    };

    expect(
        renderJizx(
            <>
                <OutOfContext3.Provider value="Provided Value" />
                <Component />
            </>,
        ),
    ).toBe('<h1>Not in Context</h1>');
});

const NestedContext = createContext('Root Value');
test('render nested provided values in correct order', () => {
    const Component: Jizx.FC<{}> = ({ children }) => {
        const value = useContext(NestedContext);
        return (
            <>
                <h1>{value}</h1>
                <div>{children}</div>
            </>
        );
    };

    const result = (
        <NestedContext.Provider value="Level 1 Value">
            <Component>
                <NestedContext.Provider value="Level 2 Value">
                    <Component>
                        <NestedContext.Provider value="Level 3 Value">
                            <Component />
                        </NestedContext.Provider>
                    </Component>
                </NestedContext.Provider>
            </Component>
        </NestedContext.Provider>
    );

    expect(renderJizx(result)).toBe(
        renderJizx(
            <>
                <h1>Level 1 Value</h1>
                <div>
                    <h1>Level 2 Value</h1>
                    <div>
                        <h1>Level 3 Value</h1>
                        <div></div>
                    </div>
                </div>
            </>,
        ),
    );
});

type Nesting = {
    name: string;
    children?: Nesting[];
};
const RecursiveNestedContext = createContext<string[]>([]);
test('render recursive nested provided values in correct order', () => {
    const ChildrenComponent: Jizx.FC<{ nestings?: Nesting[] }> = ({ nestings }) => {
        const value = useContext(RecursiveNestedContext);
        return (
            <div>
                <h1>{value.join('.')}</h1>
                <>{nestings ? nestings.map((nesting) => <Component nesting={nesting} />) : ''}</>
            </div>
        );
    };
    const Component: Jizx.FC<{ nesting: Nesting }> = ({ nesting }) => {
        const AnonymousComponent: Jizx.FC<{ nestingInner: Nesting }> = ({ nestingInner }) => {
            const value = useContext(RecursiveNestedContext);
            return (
                <RecursiveNestedContext.Provider value={[...value, nestingInner.name]}>
                    <ChildrenComponent nestings={nestingInner.children} />
                </RecursiveNestedContext.Provider>
            );
        };
        return <AnonymousComponent nestingInner={nesting} />;
    };

    const result = (
        <Component
            nesting={{
                name: '1',
                children: [
                    {
                        name: '1',
                        children: [
                            {
                                name: '1',
                                children: [
                                    {
                                        name: '1',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                name: '2',
                                children: [
                                    {
                                        name: '1',
                                        children: [],
                                    },
                                    {
                                        name: '2',
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        name: '2',
                        children: [
                            {
                                name: '1',
                                children: [
                                    {
                                        name: '1',
                                        children: [],
                                    },
                                    {
                                        name: '2',
                                        children: [],
                                    },
                                ],
                            },
                            {
                                name: '2',
                                children: [
                                    {
                                        name: '1',
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            }}
        />
    );

    expect(renderJizx(result)).toBe(
        renderJizx(
            <div>
                <h1>1</h1>
                <div>
                    <h1>1.1</h1>
                    <div>
                        <h1>1.1.1</h1>
                    </div>
                    <div>
                        <h1>1.1.1</h1>
                    </div>
                </div>
                <div>
                    <h1>1.2</h1>
                    <div>
                        <h1>1.2.1</h1>
                        <div>
                            <h1>1.2.1.1</h1>
                        </div>
                        <div>
                            <h1>1.2.1.2</h1>
                        </div>
                    </div>
                    <div>
                        <h1>1.2.2</h1>
                        <div>
                            <h1>1.2.2.1</h1>
                        </div>
                    </div>
                </div>
            </div>,
        ),
    );
});
