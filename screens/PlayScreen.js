import {View, Text, FlatList, TouchableOpacity, SafeAreaView} from 'react-native';
import {get_puzzle_pieces} from '../services/GameReqService';
import {useState, useEffect} from 'react';
import {styles} from '../utilities/CustomStyles';
import DraggableSource from '../components/DraggableSource';
import DraggableTarget from '../components/DraggableTarget';
import ZoomableView from '../components/ZoomableView';
import {Shared} from '../utilities/Shared';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BannerAd from '../components/ads/BannerAd';

export default function PlayScreen({route, navigation}) {
    const {puzzle, image_url} = route.params;
    const [columnCount, rowCount] = puzzle.type.split('x');

    const [pieces, setPieces] = useState([]);
    const [fetchCount, setFetchCount] = useState(0);
    const [isDisableScroll, setIsDisableScroll] = useState(false);
    const [targets, setTargets] = useState([]);
    const [showImage, setShowImage] = useState(false);

    function dragdrop(x, y, item, isTarget) {
        if (!isTarget) {
        const _pieces = [...pieces];
        for (var i = 0; i < _pieces.length; i++) {
            if (_pieces[i].id == item.id) {
            _pieces.splice(i, 1);
            break;
            }
        }
        setPieces(_pieces);

        const _targets = [...targets];
        _targets.push({
            pos: {x: x, y: y},
            item: item,
            locked: false,
        });
        setTargets(_targets);
        } else {
        }
        return false;
    }

    useEffect(() => {
        const on_leave = navigation.addListener('beforeRemove', () => {
            Shared.lastScale = 1;
            Shared.lastPanX = 0;
            Shared.lastPanY = 0;
        });
        return on_leave;
      }, [navigation]);

    useEffect(() => {
        if (pieces.length == 0) {
        get_puzzle_pieces(puzzle.id, 'idle').then(_pieces =>
            setPieces(pieces.concat(_pieces)),
        );
        setFetchCount(fetchCount + 10);
        }
    }, []);

    return (
        <View style={{flex: 1}}>
        {pieces.length > 0 ? (
            <View
            style={{
                flex: 1,
                overflow: 'visible',
            }}>
            <SafeAreaView style={{zIndex: 1000, backgroundColor: '#455C7B'}}>
                <TouchableOpacity
                style={styles.buttonShowImage}
                onPress={async () => {
                    setShowImage(!showImage);
                }}>
                <Ionicons
                    name={showImage ? 'eye-off' : 'eye'}
                    size={25}
                    color="#fff"
                />
                </TouchableOpacity>
            </SafeAreaView>
            <ZoomableView
                style={[styles.play_area]}
                columnCount={columnCount}
                showImage={showImage}
                imageUrl={image_url}>
                {targets.map((data, idx) => {
                return (
                    <DraggableTarget
                    key={data.item.id}
                    data={data}
                    dragdrop={dragdrop}
                    />
                );
                })}
            </ZoomableView>

            <FlatList
                style={[styles.pieces_container]}
                data={pieces}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                <DraggableSource
                    item={item}
                    setIsDisableScroll={setIsDisableScroll}
                    dragdrop={dragdrop}
                    showImage={showImage}
                />
                )}
                horizontal={true}
                scrollEnabled={!isDisableScroll}
                showsHorizontalScrollIndicator={false}
                onEndReached={() => {
                get_puzzle_pieces(puzzle.id, 'idle', 10, fetchCount).then(
                    _pieces => setPieces(pieces.concat(_pieces)),
                );
                setFetchCount(fetchCount + 10);
                }}
            />
            </View>
        ) : (
            <Text>Loading...</Text>
        )}
        <SafeAreaView style={{backgroundColor: '#455C7B'}}>
            <BannerAd />
        </SafeAreaView>
        </View>
    );
}
