var React = require('react-native');
var { ListView, PropTypes, ScrollView } = React;
var SGListViewCell = require('./SGListViewCell');

var SGListView = React.createClass({

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

  getDefaultProps: function() {
    return {
      premptiveLoading: 2,
    }
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

  getNativeListView() {
    return this.refs.nativeListView;
  },

  /**
   * Render Methods
   */

  render: function() {
    return (
      <ListView {...this.props}
        ref='nativeListView'
        renderScrollComponent={this.renderScrollComponent}
        renderRow={this.renderRow}
        onChangeVisibleRows={this.onChangeVisibleRows} />
    );
  },

  renderScrollComponent: function(props) {
    if (props.renderScrollComponent) {
      return props.renderScrollComponent(props);
    } else {
      return (
        <ScrollView {...props} />
      );
    }
  },

  renderRow(rowData, sectionID, rowID) {
    // Get the user's view
    var view = this.props.renderRow(rowData, sectionID, rowID);

    // Wrap the user's view in a SGListViewCell for tracking & performance
    return <SGListViewCell
              usersView={view}
              ref={(row) => {
                // Capture a reference to the cell on creation
                // We have to do it this way for ListView: https://github.com/facebook/react-native/issues/897
                PrivateMethods.captureReferenceFor(this.cellData, sectionID, rowID, row);
              }}/>
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
});

/**
 * Some methods are stored here. The benefit of doing so are:
 * 1. The methods are truly private from the outside (unliked the _methodName pattern)
 * 2. The methods aren't instantiated with every instance
 * 3. They're static and hold 0 state
 * 4. Keeps the class size smaller
 */
var PrivateMethods = {
  isItemInList: function(item, list) {
    var found = false;
    for(var i = 0 ; i < list.length ; i++) {
      if(item === list[i]) {
        found = true;
        break;
      }
    }
    return found;
  },
  captureReferenceFor: function(cellData, sectionId, rowId, row) {
    if (cellData[sectionId] === undefined) {
      cellData[sectionId] = {};
    }

    cellData[sectionId][rowId] = row; // Capture the reference
  },

  /**
   * Go through the changed rows and update the cell with their new visibility state
   */
  updateCellsVisibility: function(cellData, changedRows) {
    for (var section in changedRows) {
      if (changedRows.hasOwnProperty(section)) { // Good JS hygiene check
        var currentSection = changedRows[section];

        for (var row in currentSection) {
          if (currentSection.hasOwnProperty(row)) { // Good JS hygiene check
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
  updateCellsPremptively: function(props, cellData, visibleRows) {
    if (!props.premptiveLoading) {
      return; // No need to run is preemptive loading is 0 or false
    }

    if (!cellData.lastSetOfVisibileCells) {
      cellData.lastSetOfVisibileCells = [];
    };

    // Get the first and last visible rows
    var firstVisibleRow, lastVisibleRow, firstVisibleSection, lastVisibleSection;
    var visibleCells = [];
    for (var section in visibleRows) {
      for (var row in visibleRows[section]) {
        visibleCells.push(cellData[section][row]);

        if (firstVisibleRow === undefined) {
          firstVisibleSection = section;
          firstVisibleRow = Number(row);
          lastVisibleSection = section;
          lastVisibleRow = Number(row);
        } else {
          lastVisibleSection = section;
          lastVisibleRow = Number(row);
        }

      };
    };

    // Figure out if we're scrolling up or down
    // Start by taking the previous scroll direction.
    var isScrollingDown = cellData.lastScrollDirection === 'down';

    //Did things move in the right direction?
    //Or, if we're at the top, must be going down next...
    if (cellData.firstVisibleRow < firstVisibleRow || firstVisibleRow === 0) {
      isScrollingDown = true;
    }
    var isScrollingUp = !isScrollingDown;

    // Preemptively set new cells
    var newPremptiveCells = [];
    for (var i = 1; i <= props.premptiveLoading; i++) {
      var cell;

      if (isScrollingUp){
        cell = cellData[firstVisibleSection] ? cellData[firstVisibleSection][firstVisibleRow - i] : null;
      } else if (isScrollingDown) {
        cell = cellData[lastVisibleSection] ? cellData[lastVisibleSection][lastVisibleRow + i] : null;
      }

      if (cell) {
        newPremptiveCells.push(cell);
        cell.setVisibility(true);
      } else {
        break;
      }
    }

    //Clean up anything in the old list that's not in the new list
    while(cell = cellData.lastSetOfVisibileCells.pop()) {
      if (!this.isItemInList(cell, newPremptiveCells) && !this.isItemInList(cell, visibleCells)) {
        cell.setVisibility(false);
      }
    }

    //Record our new set of premptive cells
    cellData.lastSetOfVisibileCells = newPremptiveCells; //.concat(visibleCells);

    cellData.firstVisibleRow = firstVisibleRow; // cache the first seen row
    cellData.lastVisibleRow = lastVisibleRow; // cache the last seen row

    if (isScrollingUp){
      cellData.lastScrollDirection = 'up';
    } else if (isScrollingDown) {
      cellData.lastScrollDirection = 'down';
    }

  },
};

module.exports = SGListView;
