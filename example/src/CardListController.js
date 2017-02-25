'use strict';

import React from 'react';
import { ListView, StyleSheet, Text, View } from 'react-native';
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
      if (err) console.warn(err);
      else self.setState({deals:res.body.deals});
    });
  }

  render() {
    return (
      <CardListView
        deals={this.state.deals}
        onEndReached={this.onEndReached.bind(this)}
        {...this.cache} />
    );
  }

  onEndReached() {
    this.cache.offset += 10;
    var self = this;

    DataSource.fetch(this.cache, (err, res) => {
      if (err) console.warn(err);
      else self.setState({deals:self.state.deals.concat(res.body.deals)}); // concat deals to the end of the array
    });
  }
}

module.exports = CardList;
