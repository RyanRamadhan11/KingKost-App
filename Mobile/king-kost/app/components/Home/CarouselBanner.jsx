import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const banner1 = require('../../../assets/images/banner1.jpg');
const banner2 = require('../../../assets/images/banner2.jpg');
const banner3 = require('../../../assets/images/banner3.jpg');

export default CarouselBanner = () => {
  const data = [
    { imageUrl: banner1 },
    { imageUrl: banner2 },
    { imageUrl: banner3 },
  ];

  const renderItem = ({ item }) => (
    <View style={{ width: '90%', height: 200, marginBottom: 10, marginLeft: 20, }}>
      <Image
        source={item.imageUrl}
        style={{ width: '100%', height: '100%', borderRadius: 10 , resizeMode: 'contain'}}
      />
    </View>
  );

  return (
    <Carousel
      data={data}
      loop={true}
      renderItem={renderItem}
      sliderWidth={Dimensions.get('window').width}
      itemWidth={Dimensions.get('window').width}
      layout={'default'}
      autoplay={true}
      autoplayInterval={3000}
    />
  );
};
