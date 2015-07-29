(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('Selection', ['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.Selection = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var Selection = (function () {
    function Selection(input) {
      _classCallCheck(this, Selection);

      this.input = input;
    }

    _createClass(Selection, null, [{
      key: 'parseDescription',
      value: function parseDescription(description) {
        var value = '';
        var caret = new this();
        var affinity = null;
        var valueIndex = 0;
        var parseIndex = 0;

        function parseError(chr, msg) {
          throw new Error('unexpected `' + chr + '` in ' + description + ' at character ' + parseIndex + ': ' + msg);
        }

        for (var i = 0, l = description.length; i < l; i++) {
          var chr = description[i];

          if (chr === '|' || chr === '<' || chr === '>') {
            // all of these caret markers are invalid if we already have an end
            if (caret.end !== undefined && caret.end !== null) {
              parseError(chr, 'the selection has already ended');
            }

            if (caret.start !== undefined && caret.start !== null) {
              if (chr === '<') {
                parseError(chr, '`' + chr + '` cannot be the end of a selection');
              }

              if (affinity !== null && chr === '>') {
                parseError(chr, '`' + chr + '` cannot be the end of an already-leftward selection');
              }

              caret.end = valueIndex;
              if (chr === '>') {
                affinity = 1;
              }
            } else {
              if (chr === '>') {
                parseError(chr, '`' + chr + '` cannot be the start of a selection');
              }

              caret.start = valueIndex;
              if (chr === '<') {
                affinity = 0;
              }
            }
          } else {
            value += chr;
            valueIndex++;
          }

          parseIndex++;
        }

        if (caret.start === undefined || caret.start === null) {
          parseError('EOF', 'no caret found in description');
        }

        if (affinity !== null && (caret.end === undefined || caret.end === null)) {
          parseError('EOF', 'expected `|` to end the selection');
        }

        if (caret.end === undefined || caret.end === null) {
          caret.end = caret.start;
        }

        caret.input = value;

        return { caret: caret, affinity: affinity, value: value };
      }
    }, {
      key: 'printDescription',
      value: function printDescription(data) {
        var caret = data.caret;
        var affinity = data.affinity;
        var value = data.value || caret.input;

        if (caret.start === caret.end) {
          if (affinity !== undefined && affinity !== null) {
            throw new Error('cannot have directional selection without a selection: caret=' + caret.start + '..' + caret.end + ', direction=`' + (affinity === 0 ? 'upstream' : 'downstream') + ', value=' + value + '');
          }

          return value.substring(0, caret.start) + '|' + value.substring(caret.end);
        } else {
          var result;
          result = value.substring(0, caret.start);
          result += affinity === 0 ? '<' : '|';
          result += value.substring(caret.start, caret.end);
          result += affinity === 1 ? '>' : '|';
          result += value.substring(caret.end);
          return result;
        }
      }
    }]);

    return Selection;
  })();

  module.exports = Selection;
});
