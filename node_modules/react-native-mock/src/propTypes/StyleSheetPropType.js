/**
 * https://github.com/facebook/react-native/blob/master/Libraries/StyleSheet/StyleSheetPropType.js
 */
import React from 'react';
import flattenStyle from './flattenStyle';

const { PropTypes } = React;

function StyleSheetPropType(shape) {
  var shapePropType = PropTypes.shape(shape);
  return function (props, propName, componentName, location) {
    var newProps = props;
    if (props[propName]) {
      // Just make a dummy prop object with only the flattened style
      newProps = {};
      newProps[propName] = flattenStyle(props[propName]);
    }
    return shapePropType(newProps, propName, componentName, location);
  };
}

module.exports = StyleSheetPropType;
