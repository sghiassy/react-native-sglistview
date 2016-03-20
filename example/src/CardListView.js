'use strict';

import Card from './Card';
import React, { ListView, StyleSheet } from 'react-native';

class CardListView extends React.Component {
  render() {
    return (
      <ListView
        dataSource={this.getDataSource()}
        renderRow={this.renderRow}
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
