'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _SGListViewCell = require('./SGListViewCell');

var _SGListViewCell2 = _interopRequireDefault(_SGListViewCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Some methods are stored here. The benefit of doing so are:
 * 1. The methods are truly private from the outside (unliked the _methodName pattern)
 * 2. The methods aren't instantiated with every instance
 * 3. They're static and hold 0 state
 * 4. Keeps the class size smaller
 */
var PrivateMethods = {
  captureReferenceFor: function captureReferenceFor(cellData, sectionId, rowId, row) {
    if (cellData[sectionId] === undefined) {
      cellData[sectionId] = {};
    }

    cellData[sectionId][rowId] = row; // Capture the reference
  },


  /**
   * Go through the changed rows and update the cell with their new visibility state
   */
  updateCellsVisibility: function updateCellsVisibility(cellData, visibleRows, changedRows) {
    // update changed rows
    for (var section in changedRows) {
      if (changedRows.hasOwnProperty(section)) {
        // Good JS hygiene check
        var currentSection = changedRows[section];

        for (var row in currentSection) {
          if (currentSection.hasOwnProperty(row)) {
            // Good JS hygiene check
            var currentCell = cellData[section][row];
            var currentCellVisibility = currentSection[row];

            // Set the cell's new visibility state
            if (currentCell && currentCell.setVisibility) {
              currentCell.setVisibility(currentCellVisibility);
            }
          }
        }
      }
    }

    // set visible rows visible, see https://github.com/sghiassy/react-native-sglistview/issues/12
    for (var _section in visibleRows) {
      if (visibleRows.hasOwnProperty(_section)) {
        // Good JS hygiene check
        var _currentSection = visibleRows[_section];

        for (var _row in _currentSection) {
          if (_currentSection.hasOwnProperty(_row)) {
            // Good JS hygiene check
            var _currentCell = cellData[_section][_row];

            // Set the cell visible
            if (_currentCell && _currentCell.setVisibility) {
              _currentCell.setVisibility(true);
            }
          }
        }
      }
    }
  },


  /**
   * Calculate and return the cell dimensions for the given cell (position and size)
   */
  calculateDimensionsForCell: function calculateDimensionsForCell(cellData, childFrames, sectionID, rowID, horizontal, index) {
    var row = cellData[sectionID];
    if (!row) {
      throw new Error('sectionID not found ' + sectionID);
    }
    var cell = row[rowID];
    if (!cell) {
      throw new Error('rowID not found ' + rowID);
    }
    var x = 0;
    var y = 0;

    var width = cell.viewProperties.width;
    var height = cell.viewProperties.height;
    if (childFrames.length) {
      var childFrame = childFrames[childFrames.length - 1];
      if (horizontal) {
        x = childFrame.x + childFrame.width;
      } else {
        y = childFrame.y + childFrame.height;
      }
    }
    return { x: x, y: y, width: width, height: height, index: index };
  },


  /**
   * When the user is scrolling up or down - load the cells in the future to make it
   * so the user doesn't see any flashing
   */
  updateCellsPremptively: function updateCellsPremptively(props, cellData, visibleRows) {
    if (!props.premptiveLoading) {
      return; // No need to run is preemptive loading is 0 or false
    }

    if (!cellData.premptiveLoadedCells) {
      cellData.premptiveLoadedCells = [];
    }

    // Get the first and last visible rows
    var firstVisibleRow = void 0;
    var lastVisibleRow = void 0;
    var firstVisibleSection = void 0;
    var lastVisibleSection = void 0;

    for (var section in visibleRows) {
      if (visibleRows.hasOwnProperty(section)) {
        // Good JS hygiene check
        for (var row in visibleRows[section]) {
          if (firstVisibleRow === undefined) {
            firstVisibleSection = section;
            firstVisibleRow = Number(row);
          } else {
            lastVisibleSection = section;
            lastVisibleRow = Number(row);
          }

          /*
           * Dont consider a cell preemptiveloaded if it is touched by default visibility logic.
           */
          var currentCell = cellData[section][row];
          if (cellData.premptiveLoadedCells) {
            var i = cellData.premptiveLoadedCells.indexOf(currentCell);
            if (i >= 0) {
              cellData.premptiveLoadedCells.splice(i, 1);
            }
          }
        }
      }
    }

    // Figure out if we're scrolling up or down
    var isScrollingUp = cellData.firstVisibleRow > firstVisibleRow;
    var isScrollingDown = cellData.lastVisibleRow < lastVisibleRow;

    var scrollDirectionChanged = void 0;
    if (isScrollingUp && cellData.lastScrollDirection === 'down') {
      scrollDirectionChanged = true;
    } else if (isScrollingDown && cellData.lastScrollDirection === 'up') {
      scrollDirectionChanged = true;
    }

    // remove the other side's preemptive cells
    if (scrollDirectionChanged) {
      var cell = cellData.premptiveLoadedCells.pop();

      while (cell != undefined) {
        cell.setVisibility(false);
        cell = cellData.premptiveLoadedCells.pop();
      }
    }

    // Preemptively set cells
    for (var _i = 1; _i <= props.premptiveLoading; _i++) {
      var _cell = void 0;

      if (isScrollingUp) {
        _cell = cellData[firstVisibleSection][firstVisibleRow - _i];
      } else if (isScrollingDown) {
        _cell = cellData[lastVisibleSection][lastVisibleRow + _i];
      }

      if (_cell) {
        _cell.setVisibility(true);
        cellData.premptiveLoadedCells.push(_cell);
      } else {
        break;
      }
    }

    cellData.firstVisibleRow = firstVisibleRow; // cache the first seen row
    cellData.lastVisibleRow = lastVisibleRow; // cache the last seen row

    if (isScrollingUp) {
      cellData.lastScrollDirection = 'up';
    } else if (isScrollingDown) {
      cellData.lastScrollDirection = 'down';
    }
  }
};

var SGListView = _react2.default.createClass({
  displayName: 'SGListView',


  /**
   * Object Lifecycle Methods
   */

  propTypes: _extends({}, _reactNative.ListView.propTypes, {

    /**
     * OVERRIDE LISTVIEW's DEFAULT VALUE: Made component not required, since SGListView will provide one by default
     *
     * (props) => renderable
     *
     * A function that returns the scrollable component in which the list rows
     * are rendered. Defaults to returning a ScrollView with the given props.
     */
    renderScrollComponent: _react2.default.PropTypes.func,

    /**
     * Number of cells to preeptively render in front of the users scrolling
     */
    premptiveLoading: _react.PropTypes.number
  }),

  getDefaultProps: function getDefaultProps() {
    return {
      premptiveLoading: 2
    };
  },


  /**
   * View Lifecycle Methods
   */

  componentWillMount: function componentWillMount() {
    // This object keeps track of the cell data.
    // NOTE: We don't want to trigger a render pass when updating the data here
    //       so we don't store this information in this.state.
    this.cellData = {
      lastVisibleRow: 0 };
  },
  onChangeVisibleRows: function onChangeVisibleRows(visibleRows, changedRows) {
    // Update cell visibibility per the changedRows
    PrivateMethods.updateCellsVisibility(this.cellData, visibleRows, changedRows);

    // Premepty show rows to avoid onscreen flashes
    PrivateMethods.updateCellsPremptively(this.props, this.cellData, visibleRows);

    // If the user supplied an onChangeVisibleRows function, then call it
    if (this.props.onChangeVisibleRows) {
      this.props.onChangeVisibleRows(visibleRows, changedRows);
    }
  },
  onScroll: function onScroll(e) {
    // onChangeVisibleRows not sent on windows and android; work around this
    if (_reactNative.Platform.OS !== 'ios') {
      var childFrames = [];
      var _props = this.props,
          dataSource = _props.dataSource,
          horizontal = _props.horizontal;

      var allRowIDs = dataSource.rowIdentities;
      try {
        var idx = 0;
        for (var sectionIdx = 0; sectionIdx < allRowIDs.length; sectionIdx++) {
          var sectionID = dataSource.sectionIdentities[sectionIdx];
          var rowIDs = allRowIDs[sectionIdx];

          if (this.props.renderSectionHeader) {
            childFrames.push(PrivateMethods.calculateDimensionsForCell(this.cellData, childFrames, sectionID, 'dummy', horizontal, idx++));
          }
          for (var rowIdx = 0; rowIdx < rowIDs.length; rowIdx++) {
            childFrames.push(PrivateMethods.calculateDimensionsForCell(this.cellData, childFrames, sectionID, rowIDs[rowIdx], horizontal, idx++));
          }
        }
      } catch (ex) {}
      // do nothing. This is expected

      // This code is a workaround which unfortunately depends upon calling a private method of the native list view.
      this.getNativeListView()._updateVisibleRows(childFrames); // eslint-disable-line no-underscore-dangle
    }
    if (this.props.onScroll) {
      this.props.onScroll(e);
    }
  },
  getNativeListView: function getNativeListView() {
    return this.refs.nativeListView;
  },


  // https://github.com/sghiassy/react-native-sglistview/issues/14
  getScrollResponder: function getScrollResponder() {
    return this.refs.nativeListView.getScrollResponder();
  },


  /**
   * Render Methods
   */

  renderScrollComponent: function renderScrollComponent(props) {
    var component = void 0;

    if (props.renderScrollComponent) {
      component = props.renderScrollComponent(props);
    } else {
      component = _react2.default.createElement(_reactNative.ScrollView, props);
    }

    return component;
  },


  // todo this needs to completely represent list view api
  renderRow: function renderRow(rowData, sectionID, rowID, highlightRowFunc) {
    var _this = this;

    // Get the user's view
    var view = this.props.renderRow(rowData, sectionID, rowID, highlightRowFunc);

    // Wrap the user's view in a SGListViewCell for tracking & performance
    return _react2.default.createElement(_SGListViewCell2.default, {
      usersView: view,
      ref: function ref(row) {
        // Capture a reference to the cell on creation
        // We have to do it this way for ListView: https://github.com/facebook/react-native/issues/897
        PrivateMethods.captureReferenceFor(_this.cellData, sectionID, rowID, row);
      } });
  },
  renderSectionHeader: function renderSectionHeader(sectionData, sectionID) {
    var _this2 = this;

    var view = this.props.renderSectionHeader(sectionData, sectionID);
    return _react2.default.createElement(_SGListViewCell2.default, {
      usersView: view,
      ref: function ref(section) {
        // Capture a reference to the cell on creation
        // We have to do it this way for ListView: https://github.com/facebook/react-native/issues/897
        PrivateMethods.captureReferenceFor(_this2.cellData, sectionID, 'dummy', section);
      } });
  },
  render: function render() {
    return _react2.default.createElement(_reactNative.ListView, _extends({}, this.props, {
      ref: 'nativeListView',
      renderScrollComponent: this.renderScrollComponent,
      renderRow: this.renderRow,
      renderSectionHeader: this.renderSectionHeader,
      onChangeVisibleRows: this.onChangeVisibleRows,
      onScroll: this.onScroll }));
  }
});

module.exports = SGListView;
//# sourceMappingURL=SGListView.js.map