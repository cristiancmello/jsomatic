'use strict';

const assert    = require('assert');
const Tag       = require('../src/tag');
const fsMixin   = require('../src/fsMixin');
const Mixin     = require('../src/mixin');
const fse       = require('fs-extra');

describe('Testing Tag', function(){
    // tearDown
    after(function(){
        fse.removeSync('test/data');
    });

    before(function(){
        fse.mkdirSync('test/data');
    });

    describe('#create', function(){
        it('...with name, attrs, childs', function(){
            let attrs = new Map();
            attrs.set('transform', 'translate(0,250)');
            
            let tag1 = new Tag('image', attrs, [new Tag('g1'), new Tag('g2')]);
            let tag2 = new Tag('line');
            
            let childs = [tag1, tag2];
            
            assert.equal((new Tag('g', null, childs)).toJson(), 
'{"name":"g","attrs":{},"childs":[{"name":"image","attrs":{"transform":"translate(0,250)"},"childs":\
[{"name":"g1","attrs":{},"childs":[]},{"name":"g2","attrs":{},"childs":[]}]},{"name":"line","attrs":{},"childs":[]}]}');
        });

        it('...with attrs, childs', function(){
            let attrs = new Map();
            attrs.set('transform', 'translate(0,250)');
            attrs.set('x', '100px');

            let tag1 = new Tag('image', attrs, [new Tag('g1', attrs), new Tag('g2')]);
            let tag2 = new Tag('line');
            
            let childs = [tag1, tag2]

            assert.equal(new Tag(null, attrs, childs).toJson(), '{}');
            assert.equal(new Tag('', attrs, childs).toJson(), '{}');
        });

        it('...with childs', function(){
            let tag1 = new Tag('image', null, [new Tag('g1'), new Tag('g2')]);
            let tag2 = new Tag('line');
            
            let childs = [tag1, tag2]

            assert.equal(new Tag(null, null, childs).toJson(), '{}');
            assert.equal(new Tag('', '', childs).toJson(), '{}');
        });

        it('...without childs', function(){
            let attrs = new Map();
            attrs.set('transform', 'translate(0,250)');
            attrs.set('x', '100px');
            
            assert.equal((new Tag('g', attrs)).toJson(), '{"name":"g","attrs":{"transform":"translate(0,250)","x":"100px"},"childs":[]}');
        });
        
        it('...without attrs, childs', function(){
            assert.equal((new Tag('g')).toJson(), '{"name":"g","attrs":{},"childs":[]}');
        });
        
        it('...without name, attrs, childs', function(){
            assert.equal((new Tag()).toJson(), '{}');
        });
    });

    describe('#toXml', function(){
        it('...with name, attrs, childs', function(){
            let attrs = new Map();
            attrs.set('transform', 'translate(0,250)');
            attrs.set('x', '100px');

            let tag1 = new Tag('image', attrs, [new Tag('g1', attrs), new Tag('g2')]);
            let tag2 = new Tag('line');
            
            let childs = [tag1, tag2];

            assert.equal(new Tag('g', attrs, childs).toXml(), fse.readFileSync('test/output/output-with-name-attrs-childs.xml'));
        });

        it('...with attrs, childs', function(){
            let attrs = new Map();
            attrs.set('transform', 'translate(0,250)');
            attrs.set('x', '100px');

            let tag1 = new Tag('image', attrs, [new Tag('g1', attrs), new Tag('g2')]);
            let tag2 = new Tag('line');
            
            let childs = [tag1, tag2]

            assert.equal(new Tag(null, attrs, childs).toXml(), '');
            assert.equal(new Tag('', attrs, childs).toXml(), '');
        });

        it('...with childs', function(){
            let tag1 = new Tag('image', null, [new Tag('g1'), new Tag('g2')]);
            let tag2 = new Tag('line');
            
            let childs = [tag1, tag2]

            assert.equal(new Tag(null, null, childs).toXml(), '');
            assert.equal(new Tag('', '', childs).toXml(), '');
        });

        it('...without childs', function(){
            let attrs = new Map();
            attrs.set('transform', 'translate(0,250)');
            attrs.set('x', '100px');

            assert.equal(new Tag('g', attrs).toXml(), '<g transform="translate(0,250)" x="100px"></g>');
        });

        it('...without attrs, childs', function(){
            assert.equal(new Tag('g').toXml(), '<g></g>');
        });

        it('...without name, attrs, childs', function(){
            assert.equal(new Tag().toXml(), '');
        });
    });

    describe('#saveToFile', function(){
        it('...success', function(){
            Mixin.set(Tag, fsMixin);

            let attrs = new Map();
            attrs.set('transform', 'translate(0,250)');
            attrs.set('x', '100px');
            
            let tag1 = new Tag('image', attrs, [new Tag('g1'), new Tag('g2')]);
            let tag2 = new Tag('line');
            
            let childs = [tag1, tag2];

            const tag = new Tag('g', attrs, childs);

            tag.saveToFile('test/data/output-with-name-attrs-childs.json');

            let curr = fse.readFileSync('test/data/output-with-name-attrs-childs.json', 'utf-8');
            let expected = fse.readFileSync('test/output/output-with-name-attrs-childs.json', 'utf-8');

            assert.equal(curr, expected);
        });
    });

    describe('#readFile', function(){
        it('...with name, attrs, childs', function(){
            Mixin.set(Tag, fsMixin);

            let attrs = new Map();
            attrs.set('transform', 'translate(0,250)');
            attrs.set('x', '100px');
            
            let tag1 = new Tag('image', attrs, [new Tag('g1'), new Tag('g2')]);
            let tag2 = new Tag('line');
            
            let childs = [tag1, tag2];

            const tag_expected = new Tag('g', attrs, childs);

            let tag_current = new Tag();
            tag_current.readFile('test/output/output-with-name-attrs-childs.json');

            assert.equal(tag_current.toJson(), tag_expected.toJson());
        });

        it('...without name, attrs, childs', function(){
            Mixin.set(Tag, fsMixin);

            let error = null;

            try{
                (new Tag()).readFile('test/output/output-without-name-attrs-childs.json');
            } catch(err){
                error = err;
            }

            assert.equal(error.message, 'Input file "test/output/output-without-name-attrs-childs.json" is empty');
        });
    });
});