'use strict';

require('es6-symbol/implement');

var _es6Map = require('es6-map');

var _es6Map2 = _interopRequireDefault(_es6Map);

var _es6Set = require('es6-set');

var _es6Set2 = _interopRequireDefault(_es6Set);

var _getExports = require('../core/getExports');

var _getExports2 = _interopRequireDefault(_getExports);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (context) {
  var named = new _es6Map2.default();

  function addNamed(name, node) {
    var nodes = named.get(name);

    if (nodes == null) {
      nodes = new _es6Set2.default();
      named.set(name, nodes);
    }

    nodes.add(node);
  }

  return {
    'ExportDefaultDeclaration': function ExportDefaultDeclaration(node) {
      return addNamed('default', node);
    },

    'ExportSpecifier': function ExportSpecifier(node) {
      addNamed(node.exported.name, node.exported);
    },

    'ExportNamedDeclaration': function ExportNamedDeclaration(node) {
      if (node.declaration == null) return;

      if (node.declaration.id != null) {
        addNamed(node.declaration.id.name, node.declaration.id);
      }

      if (node.declaration.declarations != null) {
        for (var _iterator = node.declaration.declarations, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var declaration = _ref;

          (0, _getExports.recursivePatternCapture)(declaration.id, function (v) {
            return addNamed(v.name, v);
          });
        }
      }
    },

    'ExportAllDeclaration': function ExportAllDeclaration(node) {
      if (node.source == null) return; // not sure if this is ever true

      var remoteExports = _getExports2.default.get(node.source.value, context);
      if (remoteExports == null) return;

      if (remoteExports.errors.length) {
        remoteExports.reportErrors(context, node);
        return;
      }
      var any = false;
      remoteExports.forEach(function (v, name) {
        return name !== 'default' && (any = true) && // poor man's filter
        addNamed(name, node);
      });

      if (!any) {
        context.report(node.source, 'No named exports found in module \'' + node.source.value + '\'.');
      }
    },

    'Program:exit': function ProgramExit() {
      for (var _iterator2 = named, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref2;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref2 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref2 = _i2.value;
        }

        var _ref3 = _ref2;
        var name = _ref3[0];
        var nodes = _ref3[1];

        if (nodes.size <= 1) continue;

        for (var _iterator3 = nodes, _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
          var _ref4;

          if (_isArray3) {
            if (_i3 >= _iterator3.length) break;
            _ref4 = _iterator3[_i3++];
          } else {
            _i3 = _iterator3.next();
            if (_i3.done) break;
            _ref4 = _i3.value;
          }

          var node = _ref4;

          if (name === 'default') {
            context.report(node, 'Multiple default exports.');
          } else context.report(node, 'Multiple exports of name \'' + name + '\'.');
        }
      }
    }
  };
};
//# sourceMappingURL=data:application/json;base64,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RHNCO1dBQXhCLE1BRU8sUUFBUSxNQUFSLENBQWUsSUFBZixrQ0FBa0QsWUFBbEQsRUFGUDtTQURGO09BSEY7S0FEYztHQTNDbEIsQ0Fka0M7Q0FBbkIiLCJmaWxlIjoicnVsZXMvZXhwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdlczYtc3ltYm9sL2ltcGxlbWVudCdcbmltcG9ydCBNYXAgZnJvbSAnZXM2LW1hcCdcbmltcG9ydCBTZXQgZnJvbSAnZXM2LXNldCdcblxuaW1wb3J0IEV4cG9ydE1hcCwgeyByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZSB9IGZyb20gJy4uL2NvcmUvZ2V0RXhwb3J0cydcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGV4dCkge1xuICBjb25zdCBuYW1lZCA9IG5ldyBNYXAoKVxuXG4gIGZ1bmN0aW9uIGFkZE5hbWVkKG5hbWUsIG5vZGUpIHtcbiAgICBsZXQgbm9kZXMgPSBuYW1lZC5nZXQobmFtZSlcblxuICAgIGlmIChub2RlcyA9PSBudWxsKSB7XG4gICAgICBub2RlcyA9IG5ldyBTZXQoKVxuICAgICAgbmFtZWQuc2V0KG5hbWUsIG5vZGVzKVxuICAgIH1cblxuICAgIG5vZGVzLmFkZChub2RlKVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAnRXhwb3J0RGVmYXVsdERlY2xhcmF0aW9uJzogKG5vZGUpID0+IGFkZE5hbWVkKCdkZWZhdWx0Jywgbm9kZSksXG5cbiAgICAnRXhwb3J0U3BlY2lmaWVyJzogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIGFkZE5hbWVkKG5vZGUuZXhwb3J0ZWQubmFtZSwgbm9kZS5leHBvcnRlZClcbiAgICB9LFxuXG4gICAgJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgaWYgKG5vZGUuZGVjbGFyYXRpb24gPT0gbnVsbCkgcmV0dXJuXG5cbiAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uLmlkICE9IG51bGwpIHtcbiAgICAgICAgYWRkTmFtZWQobm9kZS5kZWNsYXJhdGlvbi5pZC5uYW1lLCBub2RlLmRlY2xhcmF0aW9uLmlkKVxuICAgICAgfVxuXG4gICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMgIT0gbnVsbCkge1xuICAgICAgICBmb3IgKGxldCBkZWNsYXJhdGlvbiBvZiBub2RlLmRlY2xhcmF0aW9uLmRlY2xhcmF0aW9ucykge1xuICAgICAgICAgIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKGRlY2xhcmF0aW9uLmlkLCB2ID0+IGFkZE5hbWVkKHYubmFtZSwgdikpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ0V4cG9ydEFsbERlY2xhcmF0aW9uJzogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgIGlmIChub2RlLnNvdXJjZSA9PSBudWxsKSByZXR1cm4gLy8gbm90IHN1cmUgaWYgdGhpcyBpcyBldmVyIHRydWVcblxuICAgICAgY29uc3QgcmVtb3RlRXhwb3J0cyA9IEV4cG9ydE1hcC5nZXQobm9kZS5zb3VyY2UudmFsdWUsIGNvbnRleHQpXG4gICAgICBpZiAocmVtb3RlRXhwb3J0cyA9PSBudWxsKSByZXR1cm5cblxuICAgICAgaWYgKHJlbW90ZUV4cG9ydHMuZXJyb3JzLmxlbmd0aCkge1xuICAgICAgICByZW1vdGVFeHBvcnRzLnJlcG9ydEVycm9ycyhjb250ZXh0LCBub2RlKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGxldCBhbnkgPSBmYWxzZVxuICAgICAgcmVtb3RlRXhwb3J0cy5mb3JFYWNoKCh2LCBuYW1lKSA9PlxuICAgICAgICBuYW1lICE9PSAnZGVmYXVsdCcgJiZcbiAgICAgICAgKGFueSA9IHRydWUpICYmIC8vIHBvb3IgbWFuJ3MgZmlsdGVyXG4gICAgICAgIGFkZE5hbWVkKG5hbWUsIG5vZGUpKVxuXG4gICAgICBpZiAoIWFueSkge1xuICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLnNvdXJjZSxcbiAgICAgICAgICBgTm8gbmFtZWQgZXhwb3J0cyBmb3VuZCBpbiBtb2R1bGUgJyR7bm9kZS5zb3VyY2UudmFsdWV9Jy5gKVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAnUHJvZ3JhbTpleGl0JzogZnVuY3Rpb24gKCkge1xuICAgICAgZm9yIChsZXQgW25hbWUsIG5vZGVzXSBvZiBuYW1lZCkge1xuICAgICAgICBpZiAobm9kZXMuc2l6ZSA8PSAxKSBjb250aW51ZVxuXG4gICAgICAgIGZvciAobGV0IG5vZGUgb2Ygbm9kZXMpIHtcbiAgICAgICAgICBpZiAobmFtZSA9PT0gJ2RlZmF1bHQnKSB7XG4gICAgICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLCAnTXVsdGlwbGUgZGVmYXVsdCBleHBvcnRzLicpXG4gICAgICAgICAgfSBlbHNlIGNvbnRleHQucmVwb3J0KG5vZGUsIGBNdWx0aXBsZSBleHBvcnRzIG9mIG5hbWUgJyR7bmFtZX0nLmApXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICB9XG59XG4iXX0=