import {StyleSheet} from 'react-native';
import {PIECE_SIZE} from './Constants';
import {Dimensions} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_input: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 18,
    color: '#fff',
  },
  pieces_container: {
    overflow: 'visible',
    backgroundColor: '#bbbbbb',
    height: PIECE_SIZE + 20,
    zIndex: 1000,
    flexGrow: 0,
    width: '100%',
    marginTop: 80
  },
  piece_container: {
    margin: 10,
    marginHorizontal: 15,
    height: PIECE_SIZE,
    width: PIECE_SIZE,
  },
  target_container: {
    position: 'absolute',
    // borderWidth: 1,
    // borderColor: '#000',
    // backgroundColor: '#007',
    aspectRatio: 1,
  },
  piece_image: {
    flex: 1,
  },
  target_image: {
    flex: 1,
    margin: '-28.57%',
  },
  loader: {
    position: 'absolute',
  },
  play_area: {
    flex: 1,
    aspectRatio: 0.5,
    backgroundColor: '#888',
    borderRadius: 10,
    margin: 25,
    alignSelf: 'center'
  },
  buttonShowImage: {
    borderRadius: 25,
    backgroundColor: '#090',
    margin: 8,
    padding: 20,
    alignSelf: 'center',
    marginBottom: 50
  },
});
