/**
 * Created by Thomas on 01.06.2015.
 */
var assert = require('chai').assert;

describe('Basic-Test: Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            assert.equal(-1, [1,2,3].indexOf(5));
            assert.equal(-1, [1,2,3].indexOf(0));
        });
    });
});