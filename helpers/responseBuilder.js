const builder = {
    //this should be a recursive build action for building a dependencies tree
    build: function (name, version, storage) {

    },
    formatVersion: (version) => {
        let split = version.split('.');    
        if (split.length == 2) {
            
            version = version.replace('.x', '.0.0');
        } 
         if (split.length == 3) {
            version = version.replace('.x', '.0');
        }
        version = version.replace('x.', '1.');
        version = version.replace('^', '');
        version = version.replace('>=', '');
        version = version.replace('~', '');
        return version;
    }
}

module.exports = builder;