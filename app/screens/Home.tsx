import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => (
  <View style={styles.container}>
    <Text>Bem-vindo de volta!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
