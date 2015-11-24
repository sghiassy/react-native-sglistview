'use strict'

var React = require('react-native');
var SGListView = require('react-native-sglistview');

var {
  View,
  Text,
  StyleSheet,
  ListView
} = React;

var Example = React.createClass({
  getInitialState: function() {
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var rows = [];
    for(var i=0; i<100; i++) {
      rows.push(`Row ${i}`)
    }
    return {
      dataSource: ds.cloneWithRows(rows),
    };
  },

  render: function() {
    var inset = 100

    var boundingBox = {
      top: inset,
      bottom: inset,
      backgroundColor: '#fff',
    }
    var background = {
      top: 0,
      bottom: 0,
      backgroundColor: '#eee',
    }

    return (
      <View style={styles.outerContainer}>
        <View style={[styles.boundingBox, background]}/>
        <View style={[styles.boundingBox, boundingBox]}/>
        <SGListView
          contentContainerStyle={styles.container}
          preemptiveLoadDistance={-inset}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (
            <View style={styles.row}>
              <Text>{rowData}</Text>
            </View>
          )}
        />
      </View>
    );
  }
});

var styles = StyleSheet.create({
  boundingBox: {
    position: 'absolute',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'red',
    left: 0,
    right: 0,
  },
  outerContainer: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  container: {
    alignItems: 'stretch',
  },
  row: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 15,
  }
});


export default Example;
