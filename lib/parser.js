(function(require, exports){
  
  "use strict"; /*jshint sub:true, laxcomma:true, laxbreak:true */
  
  var path = require('path')
    , util = require('util')
    , expressions = require('./expressions')
    , UserAgentParser, OSParser, DeviceParser;
  
  UserAgentParser = (function(){
    function UserAgentParser(pattern, family_replacement, v1_replacement){
      /*
       * Initialize UserAgentParser.
       * 
       * Args:
       *   pattern: a regular expression string
       *   family_replacement: a string to override the matched family (optional)
       *   v1_replacement: a string to override the matched v1 (optional)
       */
      this.pattern = pattern;
      this.user_agent_re = new RegExp(this.pattern);
      this.family_replacement = family_replacement;
      this.v1_replacement = v1_replacement;
    }
    /*
    def MatchSpans(self, user_agent_string):
      match_spans = []
      match = self.user_agent_re.search(user_agent_string)
      if match:
        match_spans = [match.span(group_index)
                       for group_index in range(1, match.lastindex + 1)]
      return match_spans
    */
  
    UserAgentParser.prototype.parse = function(user_agent_string){
      var family = null, v1 = null, v2 = null, v3 = null, match;
    
      match = user_agent_string.match(this.user_agent_re);
      if( match ){
        if( this.family_replacement ){
          if( this.family_replacement.indexOf('$1') > -1 ){
            family = this.family_replacement.replace('$1', match[1]);
          }else{
            family = this.family_replacement;
          }
        }else{
          family = match[1];
        }

        if( this.v1_replacement ){
          v1 = this.v1_replacement;
        }else if( match.length >= 3){
          v1 = match[2];
        }

        if( match.length >= 4 ){
          v2 = match[3] || null;
          if( match.length >= 5 ){
            v3 = match[4] || null;
          }
        }
      }
      return {
        family: family, 
        v1: v1, 
        v2: v2, 
        v3: v3
      };
    };

    return UserAgentParser;

  })();

  OSParser = (function(){

    function OSParser(pattern, os_replacement){
      /*
       * Initialize OSParser.
       * 
       * Args:
       *   pattern: a regular expression string
       *   os_replacement: a string to override the matched os (optional)
       */
      this.pattern = pattern;
      this.user_agent_re = new RegExp(this.pattern);
      this.os_replacement = os_replacement;
    }
    /*
    def MatchSpans(self, user_agent_string):
      match_spans = []
      match = self.user_agent_re.search(user_agent_string)
      if match:
        match_spans = [match.span(group_index)
                       for group_index in range(1, match.lastindex + 1)]
      return match_spans
    */
  
    OSParser.prototype.parse = function(user_agent_string){
      var os = null, os_v1 = null , os_v2 = null, os_v3 = null
        , os_v4 = null, match;
    
      match = user_agent_string.match(this.user_agent_re);
      if( match ){
        if( this.os_replacement ){
          os = this.os_replacement;
        }else{
          os = match[1];
        }
        if( match.length >= 3){
          os_v1 = match[2] || null;
          if( match.length >= 4 ){
            os_v2 = match[3] || null;
            if( match.length >= 5 ){
              os_v3 = match[4] || null;
              if( match.length >= 6 ){
                os_v4 = match[5] || null;
              }
            }
          }
        }
      }

      return {
        os: os, 
        os_v1: os_v1, 
        os_v2: os_v2, 
        os_v3: os_v3, 
        os_v4: os_v4
      };
    };
  
    return OSParser;
  
  })();

  DeviceParser = (function(){

    function DeviceParser(pattern, device_replacement){
      //device_replacement = device_replacement ? device_replacement : null;
      /*
       * Initialize UserAgentParser.
       * 
       * Args:
       *   pattern: a regular expression string
       *   device_replacement: a string to override the matched device (optional)
       */
      this.pattern = pattern;
      this.user_agent_re = new RegExp(this.pattern);
      this.device_replacement = device_replacement;
    }
  
    /*
    def MatchSpans(self, user_agent_string):
      match_spans = []
      match = self.user_agent_re.search(user_agent_string)
      if match:
        match_spans = [match.span(group_index)
                       for group_index in range(1, match.lastindex + 1)]
      return match_spans
    */
    DeviceParser.prototype.parse = function(user_agent_string){
      var device, match;
      device = null;
      match = user_agent_string.match(this.user_agent_re);
    
      if( match ){
        if( this.device_replacement ){
          if( this.device_replacement.indexOf('$1') ){
            device = this.device_replacement.replace('$1', match[1]);
          }else{
            device = this.device_replacement;
          }
        }else{
          device = match[1];
        }
      }
      return device;
    };
  
    return DeviceParser;
  
  })();


  exports.parse = parse;
  exports.parse_user_agent = parse_user_agent;
  exports.parse_os = parse_os;
  exports.parse_device = parse_device;


  function parse(user_agent_string, js_parse_bits) {
    js_parse_bits = js_parse_bits || {};
    /*
     * Parse all the things
     * Args:
     *   user_agent_string: the full user agent string
     * Returns:
     *   A object containing parsed user_agent_string 
     */
    return {
      'user_agent': parse_user_agent(user_agent_string, js_parse_bits),
      'os': parse_os(user_agent_string, js_parse_bits),
      'device': parse_device(user_agent_string, js_parse_bits),
      'string': user_agent_string
    };
  }

  function parse_user_agent(user_agent_string, js_parse_bits){
    js_parse_bits = js_parse_bits || {};
    /*
     * Parses the user-agent string for user agent (browser) info.
     * Args:
     *   user_agent_string: The full user-agent string.
     * Returns:
     *   A object containing parsed bits.
     */
    var i, ua_parser, parsed, family, v1, v2, v3, js_override, js_user_agent_string;
    if( ('js_user_agent_family' in js_parse_bits) 
     && js_parse_bits['js_user_agent_family'] !== '' ){
      family = js_parse_bits['js_user_agent_family'];
      if( ('js_user_agent_v1' in js_parse_bits) )
        v1 = js_parse_bits['js_user_agent_v1'] || null;
      if( ('js_user_agent_v2' in js_parse_bits) )
        v2 = js_parse_bits['js_user_agent_v2'] || null;
      if( ('js_user_agent_v3' in js_parse_bits) )
        v3 = js_parse_bits['js_user_agent_v3'] || null;
    }else{
      for( i = 0; i < USER_AGENT_PARSERS.length ; i ++ ){
        ua_parser = USER_AGENT_PARSERS[i];
        parsed = ua_parser.parse(user_agent_string);
        family = parsed.family;
        v1 = parsed.v1;
        v2 = parsed.v2;
        v3 = parsed.v3;
        if( family ){
          break;
        }
      }
    }
    // Override for Chrome Frame IFF Chrome is enabled.
    if( ('js_user_agent_string' in js_parse_bits) ){
      js_user_agent_string = js_parse_bits['js_user_agent_string'];
      if( js_user_agent_string 
        && js_user_agent_string.indexOf('Chrome/') > -1 
        && user_agent_string.indexOf('chromeframe') > -1 ){
        js_override = {};
        js_override = parse_user_agent(js_user_agent_string);
        family = util.format('Chrome Frame (%s %s)', family, v1);
        v1 = js_override['major'];
        v2 = js_override['minor'];
        v3 = js_override['patch'];
      }
    }

    family = family || 'Other';
    return {
      'family': family,
      'major': v1,
      'minor': v2,
      'patch': v3
    };
  }

  function parse_os(user_agent_string, js_parse_bits){
    js_parse_bits = js_parse_bits || {};
    /*
     * Parses the user-agent string for operating system info
     * Args:
     *   user_agent_string: The full user-agent string.
     * js_parse_bits: javascript override bits.
     * Returns:
     *   A object containing parsed bits.
     */
    var i, os_parser, parsed, os, os_v1, os_v2, os_v3, os_v4;
    for( i = 0; i < OS_PARSERS.length ; i ++ ){
      os_parser = OS_PARSERS[i];
      parsed = os_parser.parse(user_agent_string);
      os = parsed.os;
      os_v1 = parsed.os_v1;
      os_v2 = parsed.os_v2;
      os_v3 = parsed.os_v3;
      os_v4 = parsed.os_v4;
      if( os ){
        break;
      }
    }
    os = os || 'Other';
    return {
      'family': os,
      'major': os_v1,
      'minor': os_v2,
      'patch': os_v3,
      'patch_minor': os_v4
    };
  }

  function parse_device(user_agent_string, ua_family, os_family){
    /*
     * Parses the user-agent string for device info.
     * Args:
     *   user_agent_string: The full user-agent string.
     *   ua_family: The parsed user agent family name.
     * Returns:
     *   A object containing parsed bits.
     */
    var i, device_parser, device, is_mobile;
    for( i = 0; i < DEVICE_PARSERS.length ; i ++ ){
      device_parser = DEVICE_PARSERS[i];
      device = device_parser.parse(user_agent_string);
      if( device ){
        break;
      }
    }
  
    os_family = device || 'Other';

    if( ua_family === null ){
      ua_family = parse_user_agent(user_agent_string)['family'];
    }

    if( os_family === null ){
      os_family = parse_os(user_agent_string)['family'];
    }
    
    // Bits to match some of dmolsen's device booleans.
    if( MOBILE_USER_AGENT_FAMILIES.indexOf(ua_family) > -1 ){
      is_mobile = true;
    }else if( MOBILE_OS_FAMILIES.indexOf(os_family) > -1 ){
      is_mobile = true;
    }else{
      is_mobile = false;
    }

    return {
      'family': device,
      'is_mobile': is_mobile,
      'is_spider': device == 'Spider'
    };
  }


  // Build the list of user agent parsers
  var USER_AGENT_PARSERS, OS_PARSERS, DEVICE_PARSERS
    , MOBILE_OS_FAMILIES, MOBILE_USER_AGENT_FAMILIES;
  
  USER_AGENT_PARSERS = [];
  OS_PARSERS = [];
  DEVICE_PARSERS = [];

  expressions['user_agent_parsers'].forEach(function(_ua_parser){
    var _regex, _family_replacement, _v1_replacement;
    _regex = _ua_parser['regex'];

    _family_replacement = null;
    if( ('family_replacement' in _ua_parser) ){
      _family_replacement = _ua_parser['family_replacement'];
    }

    _v1_replacement = null;
    if( ('v1_replacement' in _ua_parser) ){
      _v1_replacement = _ua_parser['v1_replacement'];
    }

    USER_AGENT_PARSERS.push(new UserAgentParser(_regex, _family_replacement
                                                      , _v1_replacement));
  });

  expressions['os_parsers'].forEach(function(_os_parser){
    var _regex, _os_replacement;
    _regex = _os_parser['regex'];

    _os_replacement = null;
    if( ('os_replacement' in _os_parser) ){
      _os_replacement = _os_parser['os_replacement'];
    }

    OS_PARSERS.push(new OSParser(_regex, _os_replacement));
  });

  expressions['device_parsers'].forEach(function(_device_parser){
    var _regex, _device_replacement;
    _regex = _device_parser['regex'];

    _device_replacement = null;
    if( ('device_replacement' in _device_parser) ){
      _device_replacement = _device_parser['device_replacement'];
    }

    DEVICE_PARSERS.push(new DeviceParser(_regex, _device_replacement));
  });

  MOBILE_USER_AGENT_FAMILIES = expressions['mobile_user_agent_families'];
  MOBILE_OS_FAMILIES = expressions['mobile_os_families'];
})(require, exports);