'use strict';

var _jsxAstUtils = require('jsx-ast-utils');

var errorMessage = 'onBlur must be used instead of onchange, ' + 'unless absolutely necessary and it causes no negative consequences ' + 'for keyboard only or screen reader users.'; /**
                                                                                                                                                                                       * @fileoverview Enforce usage of onBlur over onChange for accessibility.
                                                                                                                                                                                       * @author Ethan Cohen
                                                                                                                                                                                       */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

module.exports = function (context) {
  return {
    JSXOpeningElement: function JSXOpeningElement(node) {
      var onChange = (0, _jsxAstUtils.getProp)(node.attributes, 'onChange');
      var hasOnBlur = (0, _jsxAstUtils.getProp)(node.attributes, 'onBlur') !== undefined;

      if (onChange && !hasOnBlur) {
        context.report({
          node: node,
          message: errorMessage
        });
      }
    }
  };
};

module.exports.schema = [{ type: 'object' }];