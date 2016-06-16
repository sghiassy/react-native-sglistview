
import ImagePicker from '../NativeModules/ImagePickerIOS';

const ImagePickerIOS = {
  canRecordVideos(callback) {
    return ImagePicker.canRecordVideos(callback);
  },
  canUseCamera(callback) {
    return ImagePicker.canUseCamera(callback);
  },
  openCameraDialog(config, successCallback, cancelCallback) {
    config = {
      videoMode: false,
      ...config,
    };
    return ImagePicker.openCameraDialog(config, successCallback, cancelCallback);
  },
  openSelectDialog(config, successCallback, cancelCallback) {
    config = {
      showImages: true,
      showVideos: false,
      ...config,
    };
    return ImagePicker.openSelectDialog(config, successCallback, cancelCallback);
  },
};

module.exports = ImagePickerIOS;
