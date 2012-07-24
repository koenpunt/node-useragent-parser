
/*
 * Module dependencies
 */

var user_agent_parser = require('../')
  , should = require('should');


describe('parser', function(){
  
  describe('#parse()', function(){
    it('should identify', function(){
      var result, expected
        , user_agent_string = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10.4; fr; rv:1.9.1.5) Gecko/20091102 Firefox/3.5.5,gzip(gfe),gzip(gfe)';
      expected = {
        'device': {
          'is_spider': false,
          'is_mobile': false,
          'family': null
        },
        'os': {
          'family': 'Mac OS X',
          'major': '10',
          'minor': '4',
          'patch': null,
          'patch_minor': null
        },
        'user_agent': {
          'family': 'Firefox',
          'major': '3',
          'minor': '5',
          'patch': '5'
        },
        'string': user_agent_string
      }

      result = user_agent_parser.parse(user_agent_string);
      result.should.eql(expected);      
    });
  });


});
