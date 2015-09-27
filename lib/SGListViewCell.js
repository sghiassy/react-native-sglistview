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
    this.initialized = false
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

  /* Every time the element is laid out, it is responsible for removing its previous
   * interval from the interval tree and registering a new interval:
   */
  onLayout(evt) {
    if( this.interval ) {
      this.props.removeFromTree(this.interval)
    }

    var layout = evt.nativeEvent.layout

    this.interval = [layout.y, layout.y + layout.height]
    this.interval.cell = this

    this.props.addToTree(this.interval)

    this.viewProperties.width = layout.width;
    this.viewProperties.height = layout.height;

    // Set the initial visibility state the first time it's laid out:
    if( ! this.initialized ) {
      this.initialized = true
      if( ! this.props.isVisible(this.interval) ) this.setVisibility(false)
    }
  },

  /**
   * View Management Methods
   */
  setVisibility(visibility) {
    if (visibility == true) {
      this.setState({visibility: true});
    } else {
      this.setState({visibility: false});
    }
  },
});

module.exports = SGListViewCell;
