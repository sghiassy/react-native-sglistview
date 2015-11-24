var React = require('react-native');
var { Text, View } = React;
var PropTypes = React.PropTypes;

var SGListViewCell = React.createClass({

  /**
   * Object Lifecycle Methods
   */

  propTypes: {
    /**
     * This is the user's view as supplied by their datasource
     */
    usersView: PropTypes.element.isRequired
  },

  getInitialState() {
    return {
      visibility: true,
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    // Prevent component updates if the a visible component is set to visible
    // or vice versa:
    return nextState.visibility !== this.state.visibility;
  },

  /**
   * View Lifecycle Methods
   */
  componentDidMount() {
    // Don't want to trigger a render pass, so we're putting the view property
    // data directly on the class
    this.viewProperties = {
      width: 0, // the view defaults to width of size 0
      height: 0, // the view defaults to height of size 0
    };
    this.interval = null
    this.hasTestedInitialVisibility = false
  },

  componentWillUnmount() {
    if( this.interval ) {
      this.props.removeFromTree(this.interval)
    }
  },

  /**
   * Render Methods
   */

  render: function() {
    if (this.state.visibility === false) {
      return (
        <View style={{width:this.viewProperties.width, height:this.viewProperties.height}}></View>
      );
    }
    return (
      <View onLayout={this.onLayout}>
        {this.props.usersView}
      </View>
    );
  },

  onLayout(evt) {
    // If this element has registered its interval, remove it from the interval tree:
    if( this.interval ) {
      this.props.removeFromTree(this.interval)
    }

    var layout = evt.nativeEvent.layout

    // The interval is a two-element list with the lower bound and upper bound:
    this.interval = [layout.y, layout.y + layout.height]

    // Add a reference to this cell with a simple object property on the interval
    // list (this is the currently-accepted way to connect the interval to some object:
    this.interval.cell = this

    // Add this interval to the interval tree:
    this.props.addToTree(this.interval)

    // Store the width and height so when the view is swapped with a placeholder we
    // have the required size:
    this.viewProperties.width = layout.width;
    this.viewProperties.height = layout.height;

    // Set the initial visibility state the first time it's laid out:
    if( ! this.hasTestedInitialVisibility ) {
      this.hasTestedInitialVisibility = true

      var isInsideVisibleInterval = this.props.isVisible(this.interval)

      if( ! isInsideVisibleInterval ) {
        this.setVisibility(false)
      }
    }
  },

  /**
   * View Management Methods
   */
  setVisibility(visibility) {
    if (visibility) {
      this.setState({visibility: true});
    } else {
      this.setState({visibility: false});
    }
  },
});

module.exports = SGListViewCell;
