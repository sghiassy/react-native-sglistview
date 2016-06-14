'use strict';

var _jsxAstUtils = require('jsx-ast-utils');

var errorMessage = 'No access key attribute allowed. Inconsistencies ' + 'between keyboard shortcuts and keyboard comments used by screenreader ' + 'and keyboard only users create a11y complications.'; /**
                                                                                                                                                                                                           * @fileoverview Enforce no accesskey attribute on element.
                                                                                                                                                                                                           * @author Ethan Cohen
                                                                                                                                                                                                           */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

module.exports = function (context) {
  return {
    JSXOpeningElement: function JSXOpeningElement(node) {
      var accessKey = (0, _jsxAstUtils.getProp)(node.attributes, 'accesskey');
      var accessKeyValue = (0, _jsxAstUtils.getPropValue)(accessKey);

      if (accessKey && accessKeyValue) {
        context.report({
          node: node,
          message: errorMessage
        });
      }
    }
  };
};

module.exports.schema = [{ type: 'object' }];