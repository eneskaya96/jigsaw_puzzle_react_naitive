import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useState} from 'react';
import {get_all_images} from '../services/GameReqService';

const Item = ({_image, navigation}) => {
  const [loading, setLoading] = useState(true);

  return (
    <TouchableOpacity
      style={item_styles.container}
      onPress={() => {
        navigation.navigate('Puzzle', {
          image_id: _image.id,
          image_url: _image.url,
        });
      }}>
      {loading && <ActivityIndicator style={item_styles.loader} size="large" />}
      <Image
        style={item_styles.image}
        source={{
          uri: _image.url,
        }}
        onLoad={() => setLoading(false)}
      />
    </TouchableOpacity>
  );
};

const item_styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    position: 'absolute',
  },
  image: {
    width: '50%',
    aspectRatio: 0.5,
    resizeMode: 'cover',
    borderRadius: 10,
    margin: 10,
  },
});

export default function HomeScreen({navigation}) {
    const [images, setImages] = useState([]);

    if (images.length == 0) {
        get_all_images().then(_images => setImages(_images));
    }

    return (
        <SafeAreaView style={{flex: 1}}>
        {images.length > 0 ? (
            <View>
            <TouchableOpacity
                onPress={async () => {
                await Keychain.resetGenericPassword();
                navigation.replace('Login');
                }}
                style={{
                margin: 10,
                borderWidth: 1,
                backgroundColor: '#880',
                borderRadius: 20,
                borderColor: '#880',
                padding: 10,
                paddingHorizontal: 30,
                }}>
                <Text style={{color: '#700', fontWeight: '700'}}>QUIT</Text>
            </TouchableOpacity>

            <FlatList
                data={images}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                <Item _image={item} navigation={navigation} />
                )}
                numColumns={2}
            />
            </View>
        ) : (
            <Text>Loading...</Text>
        )}
        </SafeAreaView>
    );
}
