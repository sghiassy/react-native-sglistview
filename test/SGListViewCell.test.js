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
  });

  it('should have default props', () => {
    sgListView.node.props.premptiveLoading.should.equal(2);
  });

  it('should render', () => {
    sgListView.should.be.ok;
    sgListView.unrendered.type.displayName.should.equal('SGListView');
  });

  it('should contain a native ListView', () => {
    sgListView.nodes[0].type.displayName.should.equal('ListView');
  });

  it('should contain a ref to a native ListView component', () => {
    sgListView.nodes[0].ref.should.equal('nativeListView');
  });

});
