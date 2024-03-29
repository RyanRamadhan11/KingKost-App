import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import BackButton from './BackButton';

export default BackgroundImage = ({ source, onPress }) => (
  <View style={styles.backgroundImageContainer}>
    <ImageBackground style={styles.backgroundImage} source={source}>
      <BackButton onPress={onPress} />
    </ImageBackground>
  </View>
);

const styles = StyleSheet.create({
  backgroundImage: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  backgroundImageContainer: {
    elevation: 20,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
    height: 350,
  },
});

