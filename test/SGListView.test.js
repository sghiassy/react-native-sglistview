const should = require('should');
const { shallow } = require('enzyme');
const SGListViewCell = require('../dist/SGListViewCell');
const React = require('react');

describe('SGListView', () => {

  let sgListViewCell;

  before(() => {
    sgListViewCell = shallow(
      <SGListViewCell />
    );
  });

  it('should exist', () => {
    SGListViewCell.should.be.ok;
    sgListViewCell.should.be.ok;
  });

});
