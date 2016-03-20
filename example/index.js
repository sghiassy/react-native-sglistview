'use strict';

import React, { AppRegistry, Component, ListView, StyleSheet, Text, View } from 'react-native';
import ClientId from './config/clientId';
import http from 'superagent';
import Card from './src/Card';

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

    this.fetchDeals();
  }

  getDataSource() {
    var dataSource = new ListView.DataSource(
      {rowHasChanged: (r1, r2) => r1.uuid !== r2.uuid});

    var deals = this.state.deals;
    return deals ? dataSource.cloneWithRows(this.state.deals) : dataSource;
  }

  render() {
    return (
      <ListView
        dataSource={this.getDataSource()}
        renderRow={this.renderRow}
      />
    );
  }

  fetchDeals() {
    var self = this;
    let query = "https://api.groupon.com/v2/deals?offset=" + this.cache.offset +
                      "&client_id=" + ClientId.clientId +
                      "&client_version_id=" + ClientId.clientVersion +
                      "&division_id=portland&include_travel_bookable_deals=true&lang=en" +
                      "&lat=" + this.cache.lat +
                      "&limit=" + this.cache.limit +
                      "&lng=" + this.cache.lng + "&location_time=2015-06-09T22%3A56%3A19Z&metadata=true&secure_assets=false&show=id%2Ctitle%2CplacementPriority%2CsidebarImageUrl%2CendAt%2CdealTypes%2Cmerchant%2CisSoldOut%2CsoldQuantity%2CsoldQuantityMessage%2Cstatus%2Coptions%28images%2Ctrait%2CpricingMetadata%2CschedulerOptions%29%2CannouncementTitle%2ClargeImageUrl%2Cgrid4ImageUrl%2Cgrid6ImageUrl%2CmediumImageUrl%2CshippingAddressRequired%2CredemptionLocation%2Cchannels%2CdealUrl%2Cdivision%2CpitchHtml%2ChighlightsHtml%2CisEarly%2CisExtended%2CredemptionLocations%2CisTipped%2CtippingPoint%2ClocationNote%2CspecificAttributes%2CisTravelBookableDeal%2CisMerchandisingDeal%2Cdefault%2Cuuid%2Ctraits%2Cimages&zero_day=true";


    http.get(query)
     .end((err, res) => {
       if (err) { self.setState({deals:undefined}); return; };

       self.setState({deals:res.body.deals});
     });
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <Card deal={rowData} />
    );
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
