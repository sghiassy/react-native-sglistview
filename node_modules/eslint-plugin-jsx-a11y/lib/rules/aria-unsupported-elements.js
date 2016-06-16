'use strict';

var _DOM = require('../util/attributes/DOM');

var _DOM2 = _interopRequireDefault(_DOM);

var _ARIA = require('../util/attributes/ARIA');

var _ARIA2 = _interopRequireDefault(_ARIA);

var _jsxAstUtils = require('jsx-ast-utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var errorMessage = function errorMessage(invalidProp) {
  return 'This element does not support ARIA roles, states and properties. Try removing the prop \'' + invalidProp + '\'.';
}; /**
    * @fileoverview Enforce that elements that do not support ARIA roles,
    *  states and properties do not have those attributes.
    * @author Ethan Cohen
    */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

module.exports = function (context) {
  return {
    JSXOpeningElement: function JSXOpeningElement(node) {
      var nodeType = (0, _jsxAstUtils.elementType)(node);
      var nodeAttrs = _DOM2.default[nodeType];
      var isReservedNodeType = nodeAttrs && nodeAttrs.reserved || false;

      // If it's not reserved, then it can have ARIA-* roles, states, and properties
      if (isReservedNodeType === false) {
        return;
      }

      var invalidAttributes = Object.keys(_ARIA2.default).concat('ROLE');

      node.attributes.forEach(function (prop) {
        if (prop.type === 'JSXSpreadAttribute') {
          return;
        }

        var name = (0, _jsxAstUtils.propName)(prop);
        var normalizedName = name ? name.toUpperCase() : '';

        if (invalidAttributes.indexOf(normalizedName) > -1) {
          context.report({
            node: node,
            message: errorMessage(name)
          });
        }
      });
    }
  };
};

module.exports.schema = [{ type: 'object' }];