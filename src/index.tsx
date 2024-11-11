import { format, resolveConfig } from 'prettier';
import { renderJizx } from './jizx';

const Item: Jizx.FC<{ name: string }> = ({ name }) => (
    <>
        <li class="hello stuff">
            {'Item'} {name}
        </li>
    </>
);
const Container: Jizx.FC<{ title: string }> = ({ title, children }) => (
    <>
        {'<h1>Title:</h1>'}
        {'<p>'}
        {title}
        {'</p>'}
        {'<h1>Children:</h1>'}
        {'<div>'}
        {'<ul>'}
        {children}
        {'</ul>'}
        {'<div>'}
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

console.log(
    await format(renderJizx(result), {
        parser: 'html',
        ...(await resolveConfig('./.prettierrc.cjs')),
    }),
);
