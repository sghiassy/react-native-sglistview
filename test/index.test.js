const should = require('should');
const { shallow } = require('enzyme');
const SGListView = require('../dist');
const React = require('react');

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
    sgListView.unrendered.type.displayName.should.equal('SGListView');
    sgListView.nodes[0].ref.should.equal('nativeListView');
  });

  it('should have default props', () => {
    sgListView.node.props.premptiveLoading.should.equal(2);
  });

});
