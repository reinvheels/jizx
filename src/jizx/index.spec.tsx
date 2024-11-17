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
        console.log(value);
        return <h1>{value}</h1>;
    };

    const result = <Component />;

    expect(renderJizx(result)).toBe('<h1>Default Value</h1>');
});

test('render provided context value', () => {
    const Component = () => {
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
