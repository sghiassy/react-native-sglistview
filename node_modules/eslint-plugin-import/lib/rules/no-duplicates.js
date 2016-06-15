'use strict';

require('es6-symbol/implement');

var _es6Map = require('es6-map');

var _es6Map2 = _interopRequireDefault(_es6Map);

var _es6Set = require('es6-set');

var _es6Set2 = _interopRequireDefault(_es6Set);

var _resolve = require('../core/resolve');

var _resolve2 = _interopRequireDefault(_resolve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkImports(imported, context) {
  for (var _iterator = imported.entries(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var _ref2 = _ref;
    var _module = _ref2[0];
    var nodes = _ref2[1];

    if (nodes.size > 1) {
      for (var _iterator2 = nodes, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
        var _ref3;

        if (_isArray2) {
          if (_i2 >= _iterator2.length) break;
          _ref3 = _iterator2[_i2++];
        } else {
          _i2 = _iterator2.next();
          if (_i2.done) break;
          _ref3 = _i2.value;
        }

        var node = _ref3;

        context.report(node, '\'' + _module + '\' imported multiple times.');
      }
    }
  }
}

module.exports = function (context) {
  var imported = new _es6Map2.default();
  var typesImported = new _es6Map2.default();
  return {
    'ImportDeclaration': function ImportDeclaration(n) {
      // resolved path will cover aliased duplicates
      var resolvedPath = (0, _resolve2.default)(n.source.value, context) || n.source.value;
      var importMap = n.importKind === 'type' ? typesImported : imported;

      if (importMap.has(resolvedPath)) {
        importMap.get(resolvedPath).add(n.source);
      } else {
        importMap.set(resolvedPath, new _es6Set2.default([n.source]));
      }
    },

    'Program:exit': function ProgramExit() {
      checkImports(imported, context);
      checkImports(typesImported, context);
    }
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL25vLWR1cGxpY2F0ZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7OztBQUVBLFNBQVMsWUFBVCxDQUFzQixRQUF0QixFQUFnQyxPQUFoQyxFQUF5QztBQUN2Qyx1QkFBNEIsU0FBUyxPQUFULGdIQUE1QixJQUFnRDs7Ozs7Ozs7Ozs7OztRQUF0QyxtQkFBc0M7UUFBOUIsaUJBQThCOztBQUM5QyxRQUFJLE1BQU0sSUFBTixHQUFhLENBQWIsRUFBZ0I7QUFDbEIsNEJBQWlCLDBIQUFqQixJQUF3Qjs7Ozs7Ozs7Ozs7O1lBQWYsYUFBZTs7QUFDdEIsZ0JBQVEsTUFBUixDQUFlLElBQWYsU0FBeUIsdUNBQXpCLEVBRHNCO09BQXhCO0tBREY7R0FERjtDQURGOztBQVVBLE9BQU8sT0FBUCxHQUFpQixVQUFVLE9BQVYsRUFBbUI7QUFDbEMsTUFBTSxXQUFXLHNCQUFYLENBRDRCO0FBRWxDLE1BQU0sZ0JBQWdCLHNCQUFoQixDQUY0QjtBQUdsQyxTQUFPO0FBQ0wseUJBQXFCLDJCQUFVLENBQVYsRUFBYTs7QUFFaEMsVUFBTSxlQUFlLHVCQUFRLEVBQUUsTUFBRixDQUFTLEtBQVQsRUFBZ0IsT0FBeEIsS0FBb0MsRUFBRSxNQUFGLENBQVMsS0FBVCxDQUZ6QjtBQUdoQyxVQUFNLFlBQVksRUFBRSxVQUFGLEtBQWlCLE1BQWpCLEdBQTBCLGFBQTFCLEdBQTBDLFFBQTFDLENBSGM7O0FBS2hDLFVBQUksVUFBVSxHQUFWLENBQWMsWUFBZCxDQUFKLEVBQWlDO0FBQy9CLGtCQUFVLEdBQVYsQ0FBYyxZQUFkLEVBQTRCLEdBQTVCLENBQWdDLEVBQUUsTUFBRixDQUFoQyxDQUQrQjtPQUFqQyxNQUVPO0FBQ0wsa0JBQVUsR0FBVixDQUFjLFlBQWQsRUFBNEIscUJBQVEsQ0FBQyxFQUFFLE1BQUYsQ0FBVCxDQUE1QixFQURLO09BRlA7S0FMbUI7O0FBWXJCLG9CQUFnQix1QkFBWTtBQUMxQixtQkFBYSxRQUFiLEVBQXVCLE9BQXZCLEVBRDBCO0FBRTFCLG1CQUFhLGFBQWIsRUFBNEIsT0FBNUIsRUFGMEI7S0FBWjtHQWJsQixDQUhrQztDQUFuQiIsImZpbGUiOiJydWxlcy9uby1kdXBsaWNhdGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICdlczYtc3ltYm9sL2ltcGxlbWVudCdcbmltcG9ydCBNYXAgZnJvbSAnZXM2LW1hcCdcbmltcG9ydCBTZXQgZnJvbSAnZXM2LXNldCdcblxuaW1wb3J0IHJlc29sdmUgZnJvbSAnLi4vY29yZS9yZXNvbHZlJ1xuXG5mdW5jdGlvbiBjaGVja0ltcG9ydHMoaW1wb3J0ZWQsIGNvbnRleHQpIHtcbiAgZm9yIChsZXQgW21vZHVsZSwgbm9kZXNdIG9mIGltcG9ydGVkLmVudHJpZXMoKSkge1xuICAgIGlmIChub2Rlcy5zaXplID4gMSkge1xuICAgICAgZm9yIChsZXQgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLCBgJyR7bW9kdWxlfScgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMuYClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY29udGV4dCkge1xuICBjb25zdCBpbXBvcnRlZCA9IG5ldyBNYXAoKVxuICBjb25zdCB0eXBlc0ltcG9ydGVkID0gbmV3IE1hcCgpXG4gIHJldHVybiB7XG4gICAgJ0ltcG9ydERlY2xhcmF0aW9uJzogZnVuY3Rpb24gKG4pIHtcbiAgICAgIC8vIHJlc29sdmVkIHBhdGggd2lsbCBjb3ZlciBhbGlhc2VkIGR1cGxpY2F0ZXNcbiAgICAgIGNvbnN0IHJlc29sdmVkUGF0aCA9IHJlc29sdmUobi5zb3VyY2UudmFsdWUsIGNvbnRleHQpIHx8IG4uc291cmNlLnZhbHVlXG4gICAgICBjb25zdCBpbXBvcnRNYXAgPSBuLmltcG9ydEtpbmQgPT09ICd0eXBlJyA/IHR5cGVzSW1wb3J0ZWQgOiBpbXBvcnRlZFxuXG4gICAgICBpZiAoaW1wb3J0TWFwLmhhcyhyZXNvbHZlZFBhdGgpKSB7XG4gICAgICAgIGltcG9ydE1hcC5nZXQocmVzb2x2ZWRQYXRoKS5hZGQobi5zb3VyY2UpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbXBvcnRNYXAuc2V0KHJlc29sdmVkUGF0aCwgbmV3IFNldChbbi5zb3VyY2VdKSlcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgJ1Byb2dyYW06ZXhpdCc6IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNoZWNrSW1wb3J0cyhpbXBvcnRlZCwgY29udGV4dClcbiAgICAgIGNoZWNrSW1wb3J0cyh0eXBlc0ltcG9ydGVkLCBjb250ZXh0KVxuICAgIH0sXG4gIH1cbn1cbiJdfQ==