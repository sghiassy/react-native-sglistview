'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SGListViewCell = _react2.default.createClass({
  displayName: 'SGListViewCell',


  /**
   * Object Lifecycle Methods
   */

  propTypes: {
    /**
     * This is the user's view as supplied by their datasource
     */
    usersView: _react.PropTypes.element.isRequired
  },

  getInitialState: function getInitialState() {
    return {
      visibility: true
    };
  },


  /**
   * View Lifecycle Methods
   */
  componentDidMount: function componentDidMount() {
    // Don't want to trigger a render pass, so we're putting the view property
    // data directly on the class
    this.viewProperties = {
      width: 0, // the view defaults to width of size 0
      height: 0 };
  },
  onLayout: function onLayout(evt) {
    // When the cell has actually been layed out, record the rendered width & height
    this.viewProperties.width = evt.nativeEvent.layout.width;
    this.viewProperties.height = evt.nativeEvent.layout.height;
  },


  /**
   * View Management Methods
   */
  setVisibility: function setVisibility(visibility) {
    if (this.state.visibility == visibility) {
      return; // already have the passed in state, so return early
    }

    if (visibility == true) {
      this.setState({ visibility: true });
    } else {
      this.setState({ visibility: false });
    }
  },
  render: function render() {
    if (this.state.visibility === false) {
      return _react2.default.createElement(_reactNative.View, { style: { width: this.viewProperties.width, height: this.viewProperties.height } });
    }

    return _react2.default.createElement(
      _reactNative.View,
      { onLayout: this.onLayout },
      this.props.usersView
    );
  }
});

module.exports = SGListViewCell;
//# sourceMappingURL=SGListViewCell.js.map