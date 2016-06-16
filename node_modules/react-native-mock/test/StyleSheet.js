import React from '../src/react-native';
import { expect } from 'chai';

let {StyleSheet} = React;

describe('StyleSheet', () => {
  let styles = StyleSheet.create({
    listItem: {
      flex: 1,
      fontSize: 16,
      color: 'white'
    },
    selectedListItem: {
      color: 'green'
    },
    headerItem: {
      fontWeight: 'bold'
    }
  });

  it('flatten', () => {
    let result = StyleSheet.flatten(styles.listItem);
    let expectedResult = {
      flex: 1,
      fontSize: 16,
      color: 'white'
    };
    expect(result).to.deep.equal(expectedResult);
  });

  it('flatten with array', () => {
    let result = StyleSheet.flatten([styles.listItem, styles.selectedListItem]);
    let expectedResult = {
      flex: 1,
      fontSize: 16,
      color: 'green'
    };
    expect(result).to.deep.equal(expectedResult);
  });

  it('flatten with nested array', () => {
    let result = StyleSheet.flatten([styles.listItem, [styles.headerItem, styles.selectedListItem]]);
    let expectedResult = {
      flex: 1,
      fontSize: 16,
      color: 'green',
      fontWeight: 'bold'
    };
    expect(result).to.deep.equal(expectedResult);
  });
});
