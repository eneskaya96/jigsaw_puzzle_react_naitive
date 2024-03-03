import {View, Text, FlatList, TouchableOpacity, SafeAreaView} from 'react-native';
import {get_puzzle_pieces, save_puzzle} from '../services/GameReqService';
import {useState, useEffect, useRef} from 'react';
import {styles} from '../utilities/CustomStyles';
import DraggableSource from '../components/DraggableSource';
import DraggableTarget from '../components/DraggableTarget';
import ZoomableView from '../components/ZoomableView';
import {Shared} from '../utilities/Shared';
import Ionicons from 'react-native-vector-icons/Ionicons';
import BannerAd from '../components/ads/BannerAd';
import { PIECE_SIZE } from '../utilities/Constants';

export default function PlayScreen({route, navigation}) {
    const {puzzle, image_url} = route.params;
    const [columnCount, rowCount] = puzzle.type.split('x');

    const [readyStat, setReadyStat] = useState(0);
    const [readyAdStat, setReadyAdStat] = useState(0);
    const [pieces, setPieces] = useState([]);
    const [fetchCount, setFetchCount] = useState(0);
    const [isDisableScroll, setIsDisableScroll] = useState(false);
    const [targets, setTargets] = useState([]);
    const [showImage, setShowImage] = useState(false);
    const flatListRef = useRef(null);

    function dragdrop(x, y, item, status) {
        if (status === 0) {
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
        } else if (status ===  1) {
            const _targets = [...targets];
            for (var i = 0; i < _targets.length; i++) {
                if (_targets[i].item.id == item.id) {
                    _targets.splice(i, 1);
                    break;
                }
            }
            setTargets(_targets);

            const scrollOffset = flatListRef.current._listRef._scrollMetrics.offset;
            _idx = Math.floor((scrollOffset + x + (PIECE_SIZE+30)/2)/(PIECE_SIZE+30));
            const _pieces = [...pieces.slice(0, _idx), item, ...pieces.slice(_idx)];
            setPieces(_pieces);
        } else if (status === 2) {
            // const _pieces = [...pieces];
            // for (var i = 0; i < _pieces.length; i++) {
            //     if (_pieces[i].id == item.id) {
            //         _pieces.splice(i, 1);
            //         break;
            //     }
            // }
            // setPieces(_pieces);

            // const scrollOffset = flatListRef.current._listRef._scrollMetrics.offset;
            // _idx = Math.floor((scrollOffset + x + (PIECE_SIZE+30)/2)/(PIECE_SIZE+30));
            // const _pieces2 = [...pieces.slice(0, _idx), item, ...pieces.slice(_idx)];
            // setPieces(_pieces2);
        }
    }

    useEffect(() => {
        const on_leave = navigation.addListener('beforeRemove', () => {
            Shared.lastScale = 1;
            Shared.lastPanX = 0;
            Shared.lastPanY = 0;
        });
        return on_leave;
      }, [navigation]);


    if (readyStat === 0) {
        get_puzzle_pieces(puzzle.id, 'idle').then(_pieces => {
            setPieces(pieces.concat(_pieces));
        })
        setFetchCount(fetchCount + 10);
        setReadyStat(1);
    }

    useEffect(() => {
        if (readyStat === 2 && readyAdStat === 1) {
            setReadyStat(3);
            setReadyAdStat(2);
            get_puzzle_pieces(puzzle.id, 'correct', limit = 1000).then(_c_pieces => {
                const _targets = [...targets];
                for(const _c_piece of _c_pieces) {
                    const [_x, _y] = _c_piece.cur_pos.split('x');
                    const _target = {
                        pos: {x: _x, y: _y},
                        item: _c_piece,
                        locked: true
                    }
                    _targets.push(_target);
                }
                get_puzzle_pieces(puzzle.id, 'wrong', limit = 1000).then(_w_pieces => {
                    for(const _w_piece of _w_pieces) {
                        const [_x, _y] = _w_piece.cur_pos.split('x');
                        const _target = {
                            pos: {x: _x, y: _y},
                            item: _w_piece,
                            locked: false
                        }
                        _targets.push(_target);
                    }
                    setTargets(_targets);
                });
            });
        }
    }, [readyStat, readyAdStat]);

    return (
        <View style={{flex: 1}}>
        {pieces.length > 0 ? (
            <View
            style={{
                flex: 1,
                overflow: 'visible',
            }}
            onLayout={_ => {
                if(readyStat === 1) {
                    setReadyStat(2);
                }
                }}>
            <SafeAreaView style={{zIndex: 1000, backgroundColor: '#455C7B', 
            flexDirection:"row", justifyContent:'space-between'}}>
                <TouchableOpacity
                style={[styles.buttonShowImage]}
                onPress={async () => {
                    setShowImage(!showImage);
                    setIsDisableScroll(!showImage);
                }}>
                <Ionicons
                    name={showImage ? 'eye-off' : 'eye'}
                    size={25}
                    color="#fff"
                />
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.buttonShowImage]}
                onPress={async () => {
                    const _targets = []
                    for ( const _target of targets ) {
                        _targets.push({
                            piece_id: _target.item.id,
                            status_id: _target.locked ? 2 : 3,
                            position: Math.floor(_target.pos.x).toString() + 'x' + Math.floor(_target.pos.y).toString()
                        })
                    }
                    save_puzzle(puzzle.id, _targets);
                }}>
                <Text>
                    Save
                </Text>
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
                ref={flatListRef}
                style={[styles.pieces_container, {opacity: showImage? 0: 1}]}
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
        <View style={{backgroundColor: '#455C7B'}}>
            <BannerAd onLoad={_ => {
                if(readyAdStat === 0) {
                    setReadyAdStat(1);
                }
                }}/>
        </View>
        </View>
    );
}
