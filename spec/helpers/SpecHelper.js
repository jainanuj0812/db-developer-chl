var jsdom = require('jsdom');
const { JSDOM } = jsdom;

const { document } = (new JSDOM('<div id="data-table"></div>')).window;
global.document = document;