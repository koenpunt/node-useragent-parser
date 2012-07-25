
/*
 * Module dependencies
 */

var user_agent_parser = require('../')
  , fs = require('fs')
  , util = require('util') 
  , should = require('should')
  , yaml = require('js-yaml');


// Run a set of test cases from a YAML file
function runUserAgentTestsFromYAML(file_name){
  var yamlContents = yaml.load(fs.readFileSync(file_name));
  
  yamlContents['test_cases'].forEach( function(test_case){
    // Inputs to parse()
    var user_agent_string = test_case['user_agent_string']
      , kwds = {}, expected
      , result = {};
      
    if( ('js_ua' in test_case) ){
      kwds = test_case['js_ua'];
    }
    
    // The expected results
    expected = {'family': test_case['family'],
                'major': test_case['major'],
                'minor': test_case['minor'],
                'patch': test_case['patch']}
    
    
    result = user_agent_parser.parse_user_agent(user_agent_string, kwds);
    result.should.eql( expected, util.format("UA: %s\n expected<%s, %s, %s, %s> != actual<%s, %s, %s, %s>",
                        user_agent_string,
                        expected['family'], expected['major'], expected['minor'], expected['patch'],
                        result['family'], result['major'], result['minor'], result['patch']));
  });
}

function runOSTestsFromYAML(file_name){
  var yamlContents = yaml.load(fs.readFileSync(file_name));
  
  yamlContents['test_cases'].forEach( function(test_case){
    // Inputs to parse()
    var user_agent_string = test_case['user_agent_string']
      , kwds = {}, expected
      , result = {};
      
    if( ('js_ua' in test_case) ){
      kwds = test_case['js_ua'];
    }
    
    // The expected results
    expected = {
      'family': test_case['family'],
      'major': test_case['major'],
      'minor': test_case['minor'],
      'patch': test_case['patch'],
      'patch_minor': test_case['patch_minor']
    }

    result = user_agent_parser.parse_os(user_agent_string, kwds);
    result.should.eql( expected, util.format("UA: %s\n expected<%s %s %s %s %s> != actual<%s %s %s %s %s>",
                        user_agent_string,
                        expected['family'],
                        expected['major'],
                        expected['minor'],
                        expected['patch'],
                        expected['patch_minor'],
                        result['family'],
                        result['major'],
                        result['minor'],
                        result['patch'],
                        result['patch_minor']));
  });
}

function runDeviceTestsFromYAML(file_name){
  var yamlContents = yaml.load(fs.readFileSync(file_name));

  yamlContents['test_cases'].forEach( function(test_case){
    // Inputs to parse()
    var user_agent_string = test_case['user_agent_string']
      , kwds = {}, expected
      , result = {};
      
    if( ('js_ua' in test_case) ){
      kwds = test_case['js_ua'];
    }
    
    // The expected results
    expected = {
      'family': test_case['family'],
      'is_mobile': test_case['is_mobile'],
      'is_spider': test_case['is_spider']
    };

    result = user_agent_parser.parse_device(user_agent_string, kwds);
    result.should.eql(expected, util.format("UA: %s\n expected<%s %s %s> != actual<%s %s %s>",
            user_agent_string,
            expected['family'],
            expected['is_mobile'],
            expected['is_spider'],
            result['family'],
            result['is_mobile'],
            result['is_spider']));
  });
}



describe('parser', function(){
  
  describe('#parse()', function(){
    it('testParseAll', function(){
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
    
    it('should testBrowserscopeStrings', function(){
      runUserAgentTestsFromYAML(__dirname + '/resources/test_user_agent_parser.yaml');
    });
    it('should testBrowserscopeStringsOS', function(){
      runOSTestsFromYAML(__dirname + '/resources/test_user_agent_parser_os.yaml');
    });
    it('should testStringsOS', function(){
      runOSTestsFromYAML(__dirname + '/resources/additional_os_tests.yaml');
    });
    it('should testStringsDevice', function(){
      runDeviceTestsFromYAML(__dirname + '/resources/test_device.yaml');
    });
    it('should testMozillaStrings', function(){
      runUserAgentTestsFromYAML(__dirname + '/resources/firefox_user_agent_strings.yaml');
    });
  });


});
