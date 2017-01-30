# JsoMatic

[![Linux CI](https://travis-ci.org/cristiancmello/jsomatic.svg?branch=master)](https://travis-ci.org/cristiancmello/jsomatic)

JsoMatic provides class primitives to construct representations of XML tags in JavaScript/JSON.
It's important to note that the data format for tag persistence is JSON, only.

## Installation
```bash
npm install jsomatic
```

## Examples (for Node.js)
### Create Tag and show representation in XML
```js
const {Tag} = require('jsomatic');

let attrs = new Map();
attrs.set('transform', 'translate(0, 250px)');

let tag = new Tag('g', attrs);

console.log(tag.toXml());

/*
    OUTPUT:
    "
    <g transform="translate(0, 250px)"></g>
    "
*/
```

### ... show representation in JSON
```js
// ...
console.log(tag.toJson());

/*
    OUTPUT:
    "
    {"name":"g","attrs":{"transform":"translate(0, 250px)"},"childs":[]}
    "
*/
```

### Read JSON file and fill Tag object

- Create file called "input.json" that contains:
```json
{
    "name": "g",
    "attrs": {"transform":"translate(0, 250px)"},
    "childs": [
        {
            "name": "g",
            "attrs": {"x": "100px", "y": "45px"},
            "childs": []
        }
    ]
}
```

- Read file and show object created (JSON file, by default):
```js
const {Tag, Mixin, fsMixin} = require('jsomatic');
Mixin.set(Tag, fsMixin); // mixins to filesystem operations

// Create root element
let tag = new Tag();

// Read file and fill tag
tag.readFile('input.json');

// Show JSON
console.log(tag.toJson());

// Show XML
console.log(tag.toXml());

/*
    OUTPUT:
    "
    {"name":"g","attrs":{"transform":"translate(0, 250px)"},"childs":[{"name":"g","attrs":{"x":"100px","y":"45px"},"childs":[]}]}
    <g transform="translate(0, 250px)"><g x="100px" y="45px"></g></g>
    "
*/
```

- Save file (JSON file, by default)
```js
const {Tag, Mixin, fsMixin} = require('jsomatic');
Mixin.set(Tag, fsMixin);

let attrs = new Map();
attrs.set('transform', 'translate(0, 250px)');

let tag2 = new Tag('image', attrs);
let tag3 = new Tag('image');

let tag1 = new Tag('g', attrs, [tag2, tag3]);

tag1.saveToFile('output.json');

/*
    OUTPUT ('output.json'):

    "
    {"name":"g","attrs":{"transform":"translate(0, 250px)"},"childs":[{"name":"image","attrs":{"transform":"translate(0, 250px)"},"childs":[]},{"name":"image","attrs":{},"childs":[]}]}
    "
*/
```
