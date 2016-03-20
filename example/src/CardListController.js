'use strict';

import React, { ListView, StyleSheet, Text, View } from 'react-native';
import DataSource from './CardListDataSource';
import CardListView from './CardListView';

class CardList extends React.Component {
  constructor(props) {
    super(props);
    var self = this;

    this.state = {
      deals: []
    };

    this.cache = {
      offset: 0,
      limit: 10,
      lat: 45.52,
      lng: -122.681944
    };

    DataSource.fetch(this.cache, (err, res) => {
      self.setState({deals:res.body.deals});
    });
  }

  render() {
    return (
      <CardListView
        deals={this.state.deals}
        {...this.cache} />
    );
  }
}

module.exports = CardList;
