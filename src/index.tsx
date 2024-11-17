import { format, resolveConfig } from 'prettier';
import { createContext, renderJizx, useContext } from './jizx';

const Item: Jizx.FC<{ name: string }> = ({ name }) => (
    <>
        <li class="hello stuff">
            {'Item'} {name}
        </li>
    </>
);
const SomeContext = createContext('Default Value');
const Container: Jizx.FC<{ title: string }> = ({ title, children }) => {
    const value = useContext(SomeContext);
    return (
        <>
            <h1>Title:</h1>
            <p>{title}</p>
            <h1>Children:</h1>
            <div>
                {value}
                <ul>{children}</ul>
            </div>
        </>
    );
};

const result = (
    <SomeContext.Provider value="Provided Value">
        <Container title="My Container">
            <Item name="1" />
            <Item name="2" />
            <Item name="3" />
            <Item name="4" />
        </Container>
    </SomeContext.Provider>
);

console.log(
    await format(renderJizx(result), {
        parser: 'html',
        ...(await resolveConfig('./.prettierrc.cjs')),
    }),
);
