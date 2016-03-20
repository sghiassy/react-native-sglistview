'use strict';

import React, { AppRegistry, Component, ListView, StyleSheet, Text, View } from 'react-native';
import ClientId from './config/clientId';
import http from 'superagent';

class example extends Component {

  constructor(props) {
    super(props);

    // Instantiate the ListView's datasource
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      deals: undefined,
    };

    this.cache = {
      offset: 0,
      limit: 10,
      lat: 45.52,
      lng: -122.681944
    };

    this.getDeals();
  }

  getDataSource() {
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.uuid !== r2.uuid});

    var deals = this.props.deals;
    return deals ? dataSource.cloneWithRows(this.state.deals) : dataSource;
  }

  render() {
    return (
      <ListView
        dataSource={this.getDataSource()}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
    );
  }

  getDeals() {
    var self = this;
    var query = "https://api.groupon.com/cards/v1/search?offset=" + this.cache.offset
                      + "&client_id=" + ClientId.clientId
                      + "&client_version_id=" + ClientId.clientVersion
                      + "&ell=" + this.cache.lat + "%2C" + this.cache.lng
                      + "&limit=" + this.cache.limit + "&locale=en_US&page_type=featured&platform=iphonecon&secure_assets=false&show=deals%28default%2CstartRedemptionAt%2CendRedemptionAt%2Coptions%28images%2Ctrait%2CpricingMetadata%29%2Clocations%2Ctraits%2Cgrid4ImageUrl%2ClargeImageUrl%2CsidebarImageUrl%2Cchannels%2Cimages%2Cmerchant%28recommendations%29%29%3B_badges&sort=relevance";


    http.get(query)
     .end((err, res) => {
       if (err) { return callback(err, undefined) };

       self.setState({deals:res.body});
     });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('example', () => example);
