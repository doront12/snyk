var express = require('express');
var router = express.Router();
const request = require('request');
const rb = require('../helpers/responseBuilder');

// cache prev http requests results and return their data upon cache hit
//cache key: packageName+version 
// The cache  should be managed with LRU  in real world , to manage cache capacity + eviction methods 
// can be implemented with O(1) complexity if implemented as linkedlist + hashing.

const cache = {
    data: {}, api: {
        put: function (key, value) {
            if (!cache.data[key]) {
                cache.data[key] = [];

            }
            cache.data[key] = value;
        },
        get: function (key) {
            if (!cache.data[key]) {
                console.log('Cache Miss:' + key);
                return null;
            }
            console.log('Cache Hit:' + key);
            return cache.data[key];

        }

    }
}
const npmUrl = 'https://registry.npmjs.org/';


router.get('/:name/:version', function (req, response, next) {
    let packageName = req.params.name;
    let version = req.params.version ? req.params.version : 'latest';
    version = rb.formatVersion(version);

    let promises = [];
    handleRequest(packageName, version);

    function handleRequest(name, version) {
        if (version == '*' || version == null) {
            version = 'latest';
        }

        version = rb.formatVersion(version);
        let r = new Promise(function (res, rej) {
            version = rb.formatVersion(version);
            let cached = cache.api.get(name + version);

            //if cached  -  handle the response without sending http request

            let options = {
                method: 'GET',
                url: npmUrl + name + '/' + version,
            };

            request(options, function (error, response, body) {

                let storedObj = JSON.parse(body);
                storedObj.metaData = { name: name, version: version };
                cache.api.put(name + version, storedObj);
                if (storedObj.dependencies) {
                    let keys = Object.keys(storedObj.dependencies);

                    keys.forEach(function (k) {
                        handleRequest(k, storedObj.dependencies[k]);


                    })


                }

                res(storedObj);
                promises.push(r);

            });




        })



    }


    //this is not the way it should be in prod
    setTimeout(function () {


        Promise.all(promises).then((results) => {
            results.forEach(function (result) {
                if (result.metaData) {
                }
            });

            //the result to build as a tree
            //let result = rb.build(packageName, version, cache.data);

            response.send(results);


        })
    }, 2000)

});


module.exports = router;
