'use strict';

import React from 'react';
import { AppRegistry, StyleSheet } from 'react-native';
import CardList from './src/CardListController';

class example extends React.Component {
  render() {
    return (
      <CardList style={styles.container}/>
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
});

AppRegistry.registerComponent('example', () => example);
