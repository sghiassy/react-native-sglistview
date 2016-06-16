var _react=require('react');var _react2=_interopRequireDefault(_react);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{'default':obj};}var 




PropTypes=_react2['default'].PropTypes; /**
 * https://github.com/facebook/react-native/blob/master/Libraries/StyleSheet/TransformPropTypes.js
 */var ArrayOfNumberPropType=PropTypes.arrayOf(PropTypes.number);

var TransformMatrixPropType=function(){function TransformMatrixPropType(props,propName,componentName){
if(props.transform&&props.transformMatrix){
return new Error(
'transformMatrix and transform styles cannot be used on the same '+
'component');}


return ArrayOfNumberPropType(props,propName,componentName);}return TransformMatrixPropType;}();


var TransformPropTypes={
transform:PropTypes.arrayOf(
PropTypes.oneOfType([
PropTypes.shape({perspective:PropTypes.number}),
PropTypes.shape({rotate:PropTypes.string}),
PropTypes.shape({rotateX:PropTypes.string}),
PropTypes.shape({rotateY:PropTypes.string}),
PropTypes.shape({rotateZ:PropTypes.string}),
PropTypes.shape({scale:PropTypes.number}),
PropTypes.shape({scaleX:PropTypes.number}),
PropTypes.shape({scaleY:PropTypes.number}),
PropTypes.shape({translateX:PropTypes.number}),
PropTypes.shape({translateY:PropTypes.number}),
PropTypes.shape({skewX:PropTypes.string}),
PropTypes.shape({skewY:PropTypes.string})])),


transformMatrix:TransformMatrixPropType};


module.exports=TransformPropTypes;