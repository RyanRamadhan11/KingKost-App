import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../utils/Colors';

export default BackButton = ({ onPress }) => (
  <View style={{ paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
    <TouchableOpacity style={styles.headerBtn} onPress={onPress}>
      <Icon name="arrow-back-ios" size={20} />
    </TouchableOpacity>
  </View>
);

const styles = {
  headerBtn: {
    height: 50,
    width: 50,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 7,
  },
};

