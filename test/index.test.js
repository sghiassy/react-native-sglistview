const should = require('should');
const { shallow } = require('enzyme');
const SGListView = require('../dist');
const React = require('React');

describe('SGListView', () => {

  let sgListView;

  before(() => {
    sgListView = shallow(
      <SGListView />
    );
  });

  it('should exist', () => {
    SGListView.should.be.ok;
    sgListView.should.be.ok;
    console.log(sgListView);
  });

});
