import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import Colors from '../utils/Colors';

export default LoadingComponent = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.PRIMARY_COLOR} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});