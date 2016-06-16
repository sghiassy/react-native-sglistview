import React from '../src/react-native';
import { expect } from 'chai';

describe('Requires', () => {
  it('requires', () => {
    console.log(Object.keys(React));
    expect(true).to.equal(true);
  });
});

