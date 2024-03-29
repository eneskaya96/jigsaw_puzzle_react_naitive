import { useState, useRef } from 'react';
import React,{
    PanResponder,
    Animated,
    Image,
    ActivityIndicator,
} from 'react-native';
import { styles } from '../utilities/CustomStyles';
import { adjustPosition } from '../utilities/Methods';


const DraggableSource = (props) => {
    const [loading, setLoading] = useState(true);

    const state = {
        pan     : new Animated.ValueXY(),
        scaledSize   : useRef(new Animated.Value(1)).current,
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder : () => {
            if(props.showImage) {return false;}
            props.setIsDisableScroll(true);
            Animated.timing(
                state.scaledSize,
                {toValue:1.2, duration: 100, useNativeDriver: false}
            ).start();
            return true;
        },
        onPanResponderMove           : (e, gesture) => {
            Animated.event([null,{
                dx : state.pan.x,
                dy : state.pan.y
            }], {useNativeDriver: false})(e, gesture);
        },
        onPanResponderTerminate: (evt, gestureState) => {
            Animated.timing(
                state.pan,
                {toValue: {x:0, y:0}, duration:0, useNativeDriver: false}
            ).start();
            Animated.timing(
                state.scaledSize,
                {toValue:1, useNativeDriver: false}
            ).start();
        },
        onPanResponderRelease        : (e, gesture) => {
            props.setIsDisableScroll(false);
            Animated.timing(
                state.scaledSize,
                {toValue:1, useNativeDriver: false}
            ).start();
           
            const {x, y, status} = adjustPosition(gesture.moveX, gesture.moveY);
            if(status === 2) {
                props.dragdrop(x, y, props.item, 0);
            } else if (status === 1) {
                props.dragdrop(x, 0, props.item, 2);
            } else {
                Animated.timing(
                    state.pan,
                    {toValue: {x:0, y:0}, duration:0, useNativeDriver: false}
                ).start();
            }
        }
    });
    
    return (
        <Animated.View 
        {...panResponder.panHandlers}
        style={[state.pan.getLayout(), styles.piece_container, 
        {transform: [{scale: state.scaledSize}]}]}>
            {loading && <ActivityIndicator style={styles.piece_image} size="large" />}
            <Image style={styles.piece_image} source={{
                uri: props.item.url,
            }}
            onLoad={() => setLoading(false)}/>
        </Animated.View>
    );
}

export default DraggableSource;