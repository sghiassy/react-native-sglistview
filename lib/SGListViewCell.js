import React, {PropTypes} from 'react';
import { Text, View } from 'react-native';

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
    this.rendered = true;
  },
  
  componentWillUnmount() {
    this.rendered = false;
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
    // When the cell has actually been layed out, record the rendered width & height
    this.viewProperties.width = evt.nativeEvent.layout.width;
    this.viewProperties.height = evt.nativeEvent.layout.height;
  },

  /**
   * View Management Methods
   */
  setVisibility(visibility) {
    if (this.rendered) {
      if (this.state.visibility == visibility) {
        return; // already have the passed in state, so return early
      }
  
      if (visibility == true) {
        this.setState({visibility: true});
      } else {
        this.setState({visibility: false});
      }
    }
  },
});

module.exports = SGListViewCell;
