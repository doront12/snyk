const rb = require('../helpers/responseBuilder');
const assert = require('assert');

//test the response helper functionality
describe('responseBuilder helper  logic', function () {
    describe('#formatVersion', function () {
        it('should return fprmatted version string', function () {
            let version = '^1.1.x';
            let formattedVer = rb.formatVersion(version);
            let expected = '1.1.0';
            assert.equal(expected, formattedVer);
            version = '~1.1.x';
            formattedVer = rb.formatVersion(version);
        
            assert.equal(expected, formattedVer);
            version = '^1.1.x';
            formattedVer = rb.formatVersion(version);
        
            assert.equal(expected, formattedVer);

            assert.equal(expected, formattedVer);
            version = '^x.1.0';
            formattedVer = rb.formatVersion(version);
        
            assert.equal(expected, formattedVer);

        });
    });
});
