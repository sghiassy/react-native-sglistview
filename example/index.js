'use strict';

import React, { AppRegistry, Component, ListView, StyleSheet, Text, View } from 'react-native';
import ClientId from './config/clientId';

class example extends Component {

  constructor(props) {
    super(props);

    // Instantiate the ListView's datasource
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    };

    this.cache = {
      offset: 0,
      limit: 10,
    }
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
    );
  }

  generateQuery(callback) {
    let currentLocation = DeviceLocationManager.currentLocation();
    let rapiQuery = "https://api.groupon.com/cards/v1/search?shaheen=awwyea&offset=" + this.cache.offset + "&client_id=" + ClientId.clientId + "&client_version_id=" + ClientId.clientVersion + "&ell=" + lat + "%2C" + lng + "&limit=" + limit + "&locale=en_US&page_type=featured&platform=iphonecon&secure_assets=false&show=deals%28default%2CstartRedemptionAt%2CendRedemptionAt%2Coptions%28images%2Ctrait%2CpricingMetadata%29%2Clocations%2Ctraits%2Cgrid4ImageUrl%2ClargeImageUrl%2CsidebarImageUrl%2Cchannels%2Cimages%2Cmerchant%28recommendations%29%29%3B_badges&sort=relevance&visitor_id=E93BC28B-85E0-4266-D2BC-7E1A17384290";


    callback(false, query);
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
