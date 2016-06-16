var _DeviceEventEmitter=require('../plugins/DeviceEventEmitter');var _DeviceEventEmitter2=_interopRequireDefault(_DeviceEventEmitter);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{'default':obj};}

var app_state='active';

_DeviceEventEmitter2['default'].on('appStateDidChange',function(data){
app_state=data.app_state;});


var AppState={
getCurrentAppState:function(){function getCurrentAppState(callback,error){
Promise.resolve({app_state:app_state}).then(callback);}return getCurrentAppState;}(),


__setAppState:function(){function __setAppState(appState){
_DeviceEventEmitter2['default'].emit('appStateDidChange',{app_state:appState});}return __setAppState;}()};



module.exports=AppState;