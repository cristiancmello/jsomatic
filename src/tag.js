'use strict';

// Tag is ancestral element
/*
    Tag
    (
        name  : string
        attrs : Map
        childs : (array : Tag)
    )
*/
function Tag(name, attrs, childs)
{
    this.setName(name == undefined | name == null? '' : name);
    this.setAttrs(attrs == undefined | attrs == null? new Map() : attrs);
    this.setChilds(childs == undefined | childs == null? [] : childs);
}

Tag.prototype.getName = function()
{
    return this.name;
};

Tag.prototype.setName = function(name)
{
    this.name = name;
};

Tag.prototype.getAttrs = function()
{
    return this.attrs;
};

Tag.prototype.setAttrs = function(attrs)
{
    this.attrs = attrs;
};

Tag.prototype.getChilds = function()
{
    return this.childs;
};

Tag.prototype.setChilds = function(childs)
{
    this.childs = childs;
};

Tag.prototype.toJson = function()
{
    if (this.getName() == '')
        return '{}';

    const strMapToObj = (strMap) => {
        let obj = Object.create(null);
        for (let [k,v] of strMap)
            obj[k] = v;

        return obj;
    };
    
    const scan = (obj, _json) => {
        let k;
        if (obj instanceof Object) {
            for (k in obj){
                if (obj.hasOwnProperty(k)){
                    if (obj[k] instanceof Map)
                        _json[k] = strMapToObj(obj[k]);
                    else
                        _json[k] = obj[k];
                    
                    scan(obj[k], _json[k]);
                }
            }
        }
        
        return _json;
    };

    return JSON.stringify(scan(this, {}));
};

Tag.prototype.toXml = function()
{
    if (this.getName() == '')
        return '';

    const attrsMapToXmlAttrs = (attrs) => {
        let str_attrs = '';
        let i = 0;

       attrs.forEach((value, key) => {
            
            if (i < attrs.size - 1)
                str_attrs += `${key}="${value}" `;
            else
                str_attrs += `${key}="${value}"`;

            i++;
        });

        return str_attrs;
    };

    const scan = (obj, _xml, _tag_name) => {
        if (obj instanceof Object) {
            for (let k in obj){
                if (obj.hasOwnProperty(k)){

                    if (k == 'name'){
                         _xml += `<${obj[k]}`;
                         _tag_name = obj[k];
                    }

                    if (obj[k] instanceof Map){
                        if (obj[k].size > 0)
                            _xml += ' ' + attrsMapToXmlAttrs(obj[k]) + '>';
                        else
                            _xml += '>';
                    }  
                    
                    _xml = scan(obj[k], _xml, _tag_name);

                    if (k == 'childs')
                        _xml += `</${_tag_name}>`;
                }
            }
        }

        return _xml;
    };

    return scan(this, '');
};

module.exports = Tag;