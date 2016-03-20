'use strict';

import http from 'superagent';
import ClientId from '../config/clientId';

var CardListDataSource = {
  fetch: function(props, callback) {
    var self = this;
    let query = "https://api.groupon.com/v2/deals?offset=" + props.offset +
                      "&client_id=" + ClientId.clientId +
                      "&client_version_id=" + ClientId.clientVersion +
                      "&division_id=portland&include_travel_bookable_deals=true&lang=en" +
                      "&lat=" + props.lat +
                      "&limit=" + props.limit +
                      "&lng=" + props.lng + "&location_time=2015-06-09T22%3A56%3A19Z&metadata=true&secure_assets=false&show=id%2Ctitle%2CplacementPriority%2CsidebarImageUrl%2CendAt%2CdealTypes%2Cmerchant%2CisSoldOut%2CsoldQuantity%2CsoldQuantityMessage%2Cstatus%2Coptions%28images%2Ctrait%2CpricingMetadata%2CschedulerOptions%29%2CannouncementTitle%2ClargeImageUrl%2Cgrid4ImageUrl%2Cgrid6ImageUrl%2CmediumImageUrl%2CshippingAddressRequired%2CredemptionLocation%2Cchannels%2CdealUrl%2Cdivision%2CpitchHtml%2ChighlightsHtml%2CisEarly%2CisExtended%2CredemptionLocations%2CisTipped%2CtippingPoint%2ClocationNote%2CspecificAttributes%2CisTravelBookableDeal%2CisMerchandisingDeal%2Cdefault%2Cuuid%2Ctraits%2Cimages&zero_day=true";

    http.get(query)
     .end((err, res) => {
       if (err) { return callback(err); };

       callback(false, res);
     });
  }
};

module.exports = CardListDataSource;
