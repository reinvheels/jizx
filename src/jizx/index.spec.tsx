import { expect, test } from 'bun:test';
import { renderJizx } from 'jizx';

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
