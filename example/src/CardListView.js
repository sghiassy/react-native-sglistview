'use strict';

import Card from './subviews/Card';
import React, { StyleSheet, ListView } from 'react-native';
import SGListView from 'react-native-sglistview';

var LIST_VIEW = "listview";

class CardListView extends React.Component {
  render() {
    return (
      <SGListView
        dataSource={this.getDataSource()}
        renderRow={this.renderRow}
        onEndReached={this.props.onEndReached}
        onPullToRefresh={(sglistview)=>{
          sglistview.turnOffRefreshControl();
        }}
        ref={LIST_VIEW}
      />
    );
  }

  getDataSource() {
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.uuid !== r2.uuid});

    var deals = this.props.deals.length > 0;
    return deals ? dataSource.cloneWithRows(this.props.deals) : dataSource;
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <Card deal={rowData} />
    );
  }
}

module.exports = CardListView;
