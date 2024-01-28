import React, {View, Button} from 'react-native';
import {useRef} from 'react';
import {BannerAd, TestIds, BannerAdSize} from '@react-native-admob/admob';

const BannerAdView = () => {
  const bannerRef = useRef(null);
  return (
    <View>
      <BannerAd
        size={BannerAdSize.ADAPTIVE_BANNER}
        unitId={TestIds.BANNER}
        onAdFailedToLoad={error => console.error(error)}
        ref={bannerRef}
      />
      {/* <Button title="Reload" onPress={() => bannerRef.current?.loadAd()} /> */}
    </View>
  );
};

export default BannerAdView;
