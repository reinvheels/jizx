import { expect, test } from 'bun:test';

const BasicComponent: Jizx.FC<{ message: string }> = ({ message }) => message;
test('basic component', () => {
    const result = <BasicComponent message="" />;

    expect(result).not.toBeString();
    expect(result).toHaveProperty(['component'], 'BasicComponent');
    expect(result).toHaveProperty(['children', 'length'], 0);
});

const NestedComponent: Jizx.FC<{}> = ({}) => (
    <>
        <></>
        <></>
    </>
);
test('virtual tree', () => {
    const result = <NestedComponent />;

    expect(result).toHaveProperty(['rendered'], {
        component: 'Fragment',
        children: [
            {
                children: [],
                component: 'Fragment',
                rendered: 'FRAGMENT',
            },
            {
                children: [],
                component: 'Fragment',
                rendered: 'FRAGMENT',
            },
        ],
        rendered: 'FRAGMENT',
    });
    expect(result).toHaveProperty(['rendered', 'children', 'length'], 2);
});

test('pass string child', () => {
    const result = <BasicComponent message="">{'First Child'}</BasicComponent>;

    expect(result).toHaveProperty(
        ['children'],
        [
            {
                children: [],
                component: 'string',
                rendered: 'First Child',
            },
        ],
    );
});

test('pass children', () => {
    const result = (
        <BasicComponent message="">
            <></>
        </BasicComponent>
    );

    expect(result).toHaveProperty(
        ['children'],
        [
            {
                children: [],
                component: 'Fragment',
                rendered: 'FRAGMENT',
            },
        ],
    );
});

test('render string', () => {
    const result = <BasicComponent message="Hello World!" />;

    expect(result).toHaveProperty(['rendered'], 'Hello World!');
});

const WrapperComponent: Jizx.FC<{}> = ({ children }) => <>{children}</>;
test('render children', () => {
    const result = <WrapperComponent>{'String Child'}</WrapperComponent>;

    expect(result).toHaveProperty(['rendered'], {
        component: 'Fragment',
        children: [
            {
                children: [],
                component: 'string',
                rendered: 'String Child',
            },
        ],
        rendered: 'FRAGMENT',
    });
});

test('render html', () => {
    const result = <h1>{'String Child'}</h1>;

    expect(result).toEqual({
        component: 'Fragment',
        children: [
            // opening tag (string)
            {
                children: [],
                component: 'h1',
                rendered: '<h1>',
            },
            // ...children (VirtualComponent)}
            {
                children: [],
                component: 'string',
                rendered: 'String CHild',
            },
            // closing tag (string)
            {
                children: [],
                component: 'h1',
                rendered: '</h1>',
            },
        ],
        rendered: 'HTML',
    });
});
