import ReactDOMServer from 'react-dom/server';

const assignMeasureUnit = (value) => {
    return value !== '0' ? value + 'k' : value;
};

//@TODO Probably we can find something better then use React Server to render components to string.
const renderComponents = (elems) => ReactDOMServer.renderToString(elems);

export { assignMeasureUnit, renderComponents };
