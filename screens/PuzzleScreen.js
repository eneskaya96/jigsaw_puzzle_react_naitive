import {
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {get_image_puzzles, start_puzzle} from '../services/GameReqService';
import {useState} from 'react';

const Item = ({_puzzle, isSelected, setSelected, navigation}) => {
  return (
    <TouchableOpacity
      style={isSelected ? item_styles.buttonSelected : item_styles.button}
      onPress={() => {
        setSelected({
          id: _puzzle.id,
          status: _puzzle.status_id,
          type: _puzzle.puzzle_type,
        });
      }}>
      <Text style={{fontSize: 18, color: '#fff'}}>{_puzzle.puzzle_type}</Text>
    </TouchableOpacity>
  );
};

export default function PuzzleScreen({route, navigation}) {
  const {image_id, image_url} = route.params;
  const [puzzles, setPuzzles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState({
    id: -1,
    status: -1,
    type: '',
  });

  if (puzzles.length == 0) {
    get_image_puzzles(image_id).then(puzzles => setPuzzles(puzzles));
  }

  return (
    <SafeAreaView style={item_styles.container}>
      {puzzles.length > 0 ? (
        <View style={item_styles.container}>
          {loading && (
            <ActivityIndicator style={item_styles.loader} size="large" />
          )}
          <Image
            style={item_styles.image}
            source={{
              uri: image_url,
            }}
            onLoad={() => setLoading(false)}
          />

          <FlatList
            style={{flexGrow: 0}}
            data={puzzles}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <Item
                _puzzle={item}
                isSelected={selectedItem.id == item.id}
                setSelected={setSelectedItem}
                navigation={navigation}
              />
            )}
            horizontal={true}
          />

          {selectedItem.id != -1 && selectedItem.status != 2 ? (
            <TouchableOpacity
              style={item_styles.buttonStart}
              onPress={async () => {
                if (
                  selectedItem.status == 1 ||
                  (await start_puzzle(selectedItem.id))
                ) {
                  navigation.navigate('Play', {puzzle: selectedItem, image_url: image_url});
                }
              }}>
              <Text style={{fontSize: 18, color: '#fff'}}>
                {selectedItem.status == 1 ? 'Continue' : 'Start'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </SafeAreaView>
  );
}

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
    width: 150,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
    margin: 10,
  },
  button: {
    borderRadius: 5,
    backgroundColor: '#AA0',
    margin: 8,
    padding: 8,
  },
  buttonSelected: {
    borderRadius: 5,
    backgroundColor: '#090',
    margin: 8,
    padding: 8,
  },
  buttonStart: {
    borderRadius: 25,
    backgroundColor: '#090',
    margin: 8,
    padding: 20,
    paddingHorizontal: 40,
  },
});
