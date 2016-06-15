import React, { PropTypes } from 'react';
import { ListView, ScrollView } from 'react-native';
import SGListViewCell from './SGListViewCell';

/**
 * Some methods are stored here. The benefit of doing so are:
 * 1. The methods are truly private from the outside (unliked the _methodName pattern)
 * 2. The methods aren't instantiated with every instance
 * 3. They're static and hold 0 state
 * 4. Keeps the class size smaller
 */
const PrivateMethods = {
  captureReferenceFor(cellData, sectionId, rowId, row) {
    if (cellData[sectionId] === undefined) {
      cellData[sectionId] = {};
    }

    cellData[sectionId][rowId] = row; // Capture the reference
  },

  /**
   * Go through the changed rows and update the cell with their new visibility state
   */
  updateCellsVisibility(cellData, changedRows) {
    changedRows.forEvery((section) => {
      if (changedRows.hasOwnProperty(section)) { // Good JS hygiene check
        const currentSection = changedRows[section];

        currentSection.forEvery((row) => {
          if (currentSection.hasOwnProperty(row)) { // Good JS hygiene check
            const currentCell = cellData[section][row];
            const currentCellVisibility = currentSection[row];

            // Set the cell's new visibility state
            if (currentCell && currentCell.setVisibility) {
              currentCell.setVisibility(currentCellVisibility);
            }
          }
        });
      }
    });
  },

  /**
   * When the user is scrolling up or down - load the cells in the future to make it
   * so the user doesn't see any flashing
   */
  updateCellsPremptively(props, cellData, visibleRows) {
    if (!props.premptiveLoading) {
      return; // No need to run is preemptive loading is 0 or false
    }

    if (!cellData.premptiveLoadedCells) {
      cellData.premptiveLoadedCells = [];
    }

    // Get the first and last visible rows
    let firstVisibleRow;
    let lastVisibleRow;
    let firstVisibleSection;
    let lastVisibleSection;

    visibleRows.forEach((section) => {
      visibleRows[section].forEach((row) => {
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
        const currentCell = cellData[section][row];
        if (cellData.premptiveLoadedCells) {
          const i = cellData.premptiveLoadedCells.indexOf(currentCell);
          if (i >= 0) {
            cellData.premptiveLoadedCells.splice(i, 1);
          }
        }
      });
    });

    // Figure out if we're scrolling up or down
    const isScrollingUp = cellData.firstVisibleRow > firstVisibleRow;
    const isScrollingDown = cellData.lastVisibleRow < lastVisibleRow;

    let scrollDirectionChanged;
    if (isScrollingUp && cellData.lastScrollDirection === 'down') {
      scrollDirectionChanged = true;
    } else if (isScrollingDown && cellData.lastScrollDirection === 'up') {
      scrollDirectionChanged = true;
    }

    // remove the other side's preemptive cells
    if (scrollDirectionChanged) {
      let cell = cellData.premptiveLoadedCells.pop();

      while (cell != undefined) {
        cell.setVisibility(false);
        cell = cellData.premptiveLoadedCells.pop();
      }
    }

    // Preemptively set cells
    for (let i = 1; i <= props.premptiveLoading; i++) {
      let cell;

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
  },
};


const SGListView = React.createClass({

  /**
   * Object Lifecycle Methods
   */

  propTypes: {
    // Default the propTypes to those as specified by ListView
    ...ListView.propTypes,

    /**
     * OVERRIDE LISTVIEW's DEFAULT VALUE: Made component not required, since SGListView will provide one by default
     *
     * (props) => renderable
     *
     * A function that returns the scrollable component in which the list rows
     * are rendered. Defaults to returning a ScrollView with the given props.
     */
    renderScrollComponent: React.PropTypes.func,

    /**
     * Number of cells to preeptively render in front of the users scrolling
     */
    premptiveLoading: PropTypes.number,
  },

  getDefaultProps() {
    return {
      premptiveLoading: 2,
    };
  },

  /**
   * View Lifecycle Methods
   */

  componentWillMount() {
    // This object keeps track of the cell data.
    // NOTE: We don't want to trigger a render pass when updating the data here
    //       so we don't store this information in this.state.
    this.cellData = {
      lastVisibleRow: 0, // keep track of the last row rendered
    };
  },

  onChangeVisibleRows(visibleRows, changedRows) {
    // Update cell visibibility per the changedRows
    PrivateMethods.updateCellsVisibility(this.cellData, changedRows);

    // Premepty show rows to avoid onscreen flashes
    PrivateMethods.updateCellsPremptively(this.props, this.cellData, visibleRows);

    // If the user supplied an onChangeVisibleRows function, then call it
    if (this.props.onChangeVisibleRows) {
      this.props.onChangeVisibleRows(visibleRows, changedRows);
    }
  },

  getNativeListView() {
    return this.refs.nativeListView;
  },

  // https://github.com/sghiassy/react-native-sglistview/issues/14
  getScrollResponder() {
    return this.refs.nativeListView.getScrollResponder();
  },

  /**
   * Render Methods
   */

  renderScrollComponent(props) {
    let component;

    if (props.renderScrollComponent) {
      component = props.renderScrollComponent(props);
    } else {
      component = (
        <ScrollView {...props} />
      );
    }

    return component;
  },

  renderRow(rowData, sectionID, rowID) {
    // Get the user's view
    const view = this.props.renderRow(rowData, sectionID, rowID);

    // Wrap the user's view in a SGListViewCell for tracking & performance
    return (
      <SGListViewCell
        usersView={view}
        ref={(row) => {
          // Capture a reference to the cell on creation
          // We have to do it this way for ListView: https://github.com/facebook/react-native/issues/897
          PrivateMethods.captureReferenceFor(this.cellData, sectionID, rowID, row);
        }} />
    );
  },

  render() {
    return (
      <ListView
        {...this.props}
        ref="nativeListView"
        renderScrollComponent={this.renderScrollComponent}
        renderRow={this.renderRow}
        onChangeVisibleRows={this.onChangeVisibleRows} />
    );
  },
});

module.exports = SGListView;
