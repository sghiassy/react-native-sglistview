var React = require('react-native');
var { ListView, PropTypes, ScrollView } = React;
var SGListViewCell = require('./SGListViewCell');
var intervalTree = require('interval-tree-1d');

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
  },

  getDefaultProps: function() {
    return {
      preemptiveLoadDistance: 100,  // Number of pixels ouside the current visible window
      scrollEventThrottle: 0,
    }
  },

  /**
   * View Lifecycle Methods
   */

  componentWillMount() {
    // An interval tree that stores the vertical bounds of each cell. Each
    // cell is responsible for registering and updating its bounds.
    this.layoutTree = intervalTree([])

    // This is the previously visible scroll interval. I initially just
    // tested the currently visible range, but that made figuring out
    // changes pretty challenging (list diffing, etc.). This approach
    // simplifies things greatly and creates very little extra work for
    // reasonable scroll velocities.
    this.y1p = 0
    this.y2p = 0
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
        onScroll={this.handleScroll}
      />
    );
  },

  /**
   * Executed on every (throttled) scroll event. I don't like that, but
   * some quick timing indicates it handles the interval query in <1ms,
   * so it's definitely not a bottleneck and should perform pretty well
   * even for a large number of elements.
   */
  handleScroll: function(evt) {
    //  Expand the range that we check so we catch both cells
    //  that become visible and cells that become invisible:
    //
    //  previous interval:  |------------|
    //                     y1p          y2p
    //
    //  current interval:           |------------|
    //                             y1           y2
    //
    //  test interval:      |--------------------|
    //                     yt1                  yt2
    //
    var scrollProperties = this.refs.nativeListView.scrollProperties

    // The lower bound of the visible interval (remember lower numbers are higher
    // on the screen)
    var y1 = scrollProperties.offset

    // The upper bound is the lower bound + the height of the visible region:
    var y2 = y1 + scrollProperties.visibleLength

    // Expand the interval so that things are rendered before they come on screen:
    y1 -= this.props.preemptiveLoadDistance
    y2 += this.props.preemptiveLoadDistance

    // See above illustration:
    var yt1 = Math.min(this.y1p,y1)
    var yt2 = Math.max(this.y2p,y2)

    // Perform an interval tree query to find all cells that may become
    // either hidden or visible:
    this.layoutTree.queryInterval( yt1, yt2, (interval) => {

      // The returned interval is inside the visible area if the lower bound is
      // greater than the lower bound of the visible area (interval[0] >= y1) and
      // the upper bound is less than the upper bound of the visible area
      // (interval[1] <= y2)
      var isInsideVisibleInterval = (interval[1] >= y1) && (interval[0] <= y2)

      interval.cell.setVisibility(isInsideVisibleInterval)
    })

    // Store the previous values for comparison. This prevents us from having
    // to store a list of currently visible/hidden cells and having to compare
    // lists to figure out what's changing.
    this.y1p = y1
    this.y2p = y2
  },

  /**
   * Pass this method to SGListViewCells so that they can query their initial
   * visibility.
   */
  checkVisibility: function(interval) {
    var scrollProperties = this.refs.nativeListView.scrollProperties

    // This section is no DRY since the same logic is repeated above, but it's a
    // couple lines of arithmetic, so I won't overcomplicate this with abstraction.
    //
    // The lower bound of the visible interval:
    var y1 = scrollProperties.offset

    //The upper bound is the lower bound + the visible length:
    var y2 = y1 + scrollProperties.visibleLength

    // Expand the interval so that things are rendered before they come on screen.
    y1 -= this.props.preemptiveLoadDistance
    y2 += this.props.preemptiveLoadDistance

    // Visible if lower bound > y1 and upper bound < y2:
    var isInsideVisibleInterval = (interval[1] >= y1) && (interval[0] <= y2)

    return isInsideVisibleInterval
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

  renderRow(rowData, sectionId, rowId) {
    // Get the user's view
    var view = this.props.renderRow(rowData, sectionId, rowId);

    // Wrap the user's view in a SGListViewCell for tracking & performance
    return <SGListViewCell
              usersView={view}
              addToTree={(interval) => this.layoutTree.insert(interval)}
              removeFromTree={(interval) => {this.layoutTree.insert(interval)}}
              isVisible={(interval) => this.checkVisibility(interval)}
              />
  },

});

module.exports = SGListView;
