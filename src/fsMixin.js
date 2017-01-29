const fs = require('fs');

// fsMixin
const fsMixins = function(){};

fsMixins.prototype = {

    _saveToFile: function(name, data){
        fs.writeFileSync(name, data, 'utf-8');
    },

    _readFile: function(name){
        return fs.readFileSync(name, 'utf-8');
    },

    saveToFile: function(name){
        this._saveToFile(name, this.toJson());
    },

    saveToXmlFile: function(name){
        this._saveToFile(name, this.toXml());
    },

    readFile: function(name){
        let Tag = Object.getPrototypeOf(this).constructor;

        const objToStrMap = (_obj) => {
            let strMap = new Map();

            for (let k of Object.keys(_obj))
                strMap.set(k, _obj[k]);

            return strMap;
        };

        const objToTag = (obj) => {
            let k;

            if (obj instanceof Object){
                for (k in obj){
                    if (obj.hasOwnProperty(k)){
                        
                        // Is thre a way to verify that obj is not array
                        if (k == 'name')
                        {
                            Object.setPrototypeOf(obj, Tag.prototype);
                        }

                        if (k == 'attrs')
                        {
                            obj.setAttrs(objToStrMap(obj[k]));
                        }

                        objToTag(obj[k]);
                    }
                }
            }

            return obj;
        };

        let json;

        if ((json = this._readFile(name)) == '{}')
            throw new Error(`Input file "${name}" is empty`);

        let obj = objToTag(JSON.parse(json));
        
        // Set 'this' object as obj root
        this.setName(obj.getName());
        this.setAttrs(obj.getAttrs());
        this.setChilds(obj.getChilds());
    }
};

module.exports = fsMixins;