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

  /**
   * Render Methods
   */

  render: function() {
    return (
      <ListView {...this.props}
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
                PrvClassMethods.captureReferenceFor(this.cellData, sectionID, rowID, row);
              }}/>
  },

  onChangeVisibleRows(visibleRows, changedRows) {
    // Update cell visibibility per the changedRows
    PrvClassMethods.updateCellsVisibility(this.cellData, changedRows);

    // Premepty show rows to avoid onscreen flashes
    PrvClassMethods.updateCellsPremptively(this.props, this.cellData, visibleRows);

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
var PrvClassMethods = {
  captureReferenceFor: function(cellData, sectionId, rowId, row) {
    if (cellData[sectionId] == undefined) {
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

            // There's a possibility a cell was injected that isn't a JSCell
            var isJSCell = currentCell != undefined && currentCell.setVisibility;

            if (isJSCell) {
              // Set the cell's new visibility state
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
    if (props.premptiveLoading == false) {
      return; // No need to run is preemptive loading is 0 or false
    }

    // Quick and dirty way to get the last key in the object
    for (var section in visibleRows) {
      for (var row in visibleRows[section]);
    }
    var lastRow = Number(row); // convert lastrow key to number

    // Figure out if we're scrolling up or down
    var isScrollingUp = cellData.lastVisibleRow > lastRow;
    var isScrollingDown = cellData.lastVisibleRow < lastRow;

    // Preemptivly set cells
    for (var i = 1; i <= props.premptiveLoading; i++) {
      var cell;

      if (isScrollingUp){
        cell = cellData[section][lastRow - i];
      } else if (isScrollingDown) {
        cell = cellData[section][lastRow + i];
      }

      if (cell) {
        cell.setVisibility(true);
      } else {
        break;
      }
    }

    cellData.lastVisibleRow = lastRow; // cache the last seen row
  },
};

module.exports = SGListView;
