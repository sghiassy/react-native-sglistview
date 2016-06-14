'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _SGListViewCell = require('./SGListViewCell');

var _SGListViewCell2 = _interopRequireDefault(_SGListViewCell);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
  // keep track of the last row rendered
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

  render: function render() {
    return _react2.default.createElement(_reactNative.ListView, _extends({}, this.props, {
      ref: 'nativeListView',
      renderScrollComponent: this.renderScrollComponent,
      renderRow: this.renderRow,
      onChangeVisibleRows: this.onChangeVisibleRows }));
  },

  renderScrollComponent: function renderScrollComponent(props) {
    if (props.renderScrollComponent) {
      return props.renderScrollComponent(props);
    } else {
      return _react2.default.createElement(_reactNative.ScrollView, props);
    }
  },

  renderRow: function renderRow(rowData, sectionID, rowID) {
    var _this = this;

    // Get the user's view
    var view = this.props.renderRow(rowData, sectionID, rowID);

    // Wrap the user's view in a SGListViewCell for tracking & performance
    return _react2.default.createElement(_SGListViewCell2.default, {
      usersView: view,
      ref: function ref(row) {
        // Capture a reference to the cell on creation
        // We have to do it this way for ListView: https://github.com/facebook/react-native/issues/897
        PrivateMethods.captureReferenceFor(_this.cellData, sectionID, rowID, row);
      } });
  },
  onChangeVisibleRows: function onChangeVisibleRows(visibleRows, changedRows) {
    // Update cell visibibility per the changedRows
    PrivateMethods.updateCellsVisibility(this.cellData, changedRows);

    // Premepty show rows to avoid onscreen flashes
    PrivateMethods.updateCellsPremptively(this.props, this.cellData, visibleRows);

    // If the user supplied an onChangeVisibleRows function, then call it
    if (this.props.onChangeVisibleRows) {
      this.props.onChangeVisibleRows(visibleRows, changedRows);
    }
  }
});

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
  updateCellsVisibility: function updateCellsVisibility(cellData, changedRows) {
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
    };

    // Get the first and last visible rows
    var firstVisibleRow, lastVisibleRow, firstVisibleSection, lastVisibleSection;
    for (var section in visibleRows) {
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
        };
      };
    };

    // Figure out if we're scrolling up or down
    var isScrollingUp = cellData.firstVisibleRow > firstVisibleRow;
    var isScrollingDown = cellData.lastVisibleRow < lastVisibleRow;

    var scrollDirectionChanged;
    if (isScrollingUp && cellData.lastScrollDirection === 'down') {
      scrollDirectionChanged = true;
    } else if (isScrollingDown && cellData.lastScrollDirection === 'up') {
      scrollDirectionChanged = true;
    }

    // remove the other side's preemptive cells
    if (scrollDirectionChanged) {
      var cell;
      while (cell = cellData.premptiveLoadedCells.pop()) {
        cell.setVisibility(false);
      }
    };

    // Preemptively set cells
    for (var i = 1; i <= props.premptiveLoading; i++) {
      var cell;

      if (isScrollingUp) {
        cell = cellData[firstVisibleSection][firstVisibleRow - i];
      } else if (isScrollingDown) {
        cell = cellData[lastVisibleSection][lastVisibleRow + i];
      }

      if (cell) {
        cell.setVisibility(true);
        cellData.premptiveLoadedCells.push(cell);
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

module.exports = SGListView;
//# sourceMappingURL=SGListView.js.map