import { useRef } from 'react';
import React,{
    PanResponder,
    Animated,
    Image,
} from 'react-native';
import { styles } from '../utilities/CustomStyles';
import { adjustGesture, getTargetIdx } from '../utilities/Methods';
import { Shared } from '../utilities/Shared';


const DraggableTarget = (props) => {
    const basePanX = new Animated.Value(props.data.pos.x - Shared.targetSize/2);
    const basePanY = new Animated.Value(props.data.pos.y - Shared.targetSize/2);
    const activePanX = new Animated.Value(0);
    const activePanY = new Animated.Value(0);
    const scale = new Animated.Value(Shared.lastScale);
    const panX = Animated.add(basePanX, new Animated.divide(activePanX, scale));
    const panY = Animated.add(basePanY, new Animated.divide(activePanY, scale));
    let lastPanX = props.data.pos.x - Shared.targetSize/2;
    let lastPanY = props.data.pos.y - Shared.targetSize/2;
    const scaledSize = useRef(new Animated.Value(1)).current;
    const zIndex = new Animated.Value(Shared.lastZindex+1);


    const [final_pos_row, final_pos_column] = props.data.item.position.split('x');

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder : () => {
            if(props.data.locked) {
                return false;
            }
            Shared.lastZindex+=1;
            zIndex.setValue(Shared.lastZindex);
            scale.setValue(Shared.lastScale);
            Animated.timing(
                scaledSize,
                {toValue:1.1, duration: 100, useNativeDriver: false}
            ).start();
            return true;
        },
        onPanResponderMove           : (e, gesture) => {
            Animated.event([null,{
                dx : activePanX,
                dy : activePanY
            }], {useNativeDriver: false})(e, gesture);
        },
        onPanResponderRelease        : (e, gesture) => {
            const {column, row} = getTargetIdx(gesture.moveX, gesture.moveY);
            if(column == final_pos_column && row == final_pos_row) {
                props.data.locked = true;
                lastPanX = column*Shared.targetSize;
                lastPanY = row*Shared.targetSize;
                Animated.timing(
                    scaledSize,
                    {toValue:1.5, duration:0, useNativeDriver: false}
                ).start();
                Animated.spring(
                    scaledSize,
                    {toValue:1, speed:0.1, useNativeDriver: false}
                ).start();
            } else {
                Animated.timing(
                    scaledSize,
                    {toValue:1, useNativeDriver: false}
                ).start();
                const {x, y, adjusted} = adjustGesture(gesture.moveX, gesture.moveY);
                if(x!=-1 && y!=-1) {
                    if(!adjusted.x) {
                        lastPanX += activePanX._value/Shared.lastScale;
                    } else {
                        lastPanX = x - Shared.targetSize/2;
                    }
                    if(!adjusted.y) {
                        lastPanY += activePanY._value/Shared.lastScale;
                    } else {
                        lastPanY = y - Shared.targetSize/2;
                    }
                } else {
                    props.dragdrop(gesture.moveX, gesture.moveY, props.item, true);
                }
            }
            props.data.pos.x = lastPanX + Shared.targetSize/2;
            props.data.pos.y = lastPanY + Shared.targetSize/2;
            basePanX.setValue(lastPanX);
            basePanY.setValue(lastPanY);
            activePanX.setValue(0);
            activePanY.setValue(0);
        }
    });
    
    return (
        <Animated.View 
        {...panResponder.panHandlers}
        style={[{left: panX, top: panY}, styles.target_container,
        { width: Shared.targetSize, zIndex: zIndex, transform: [{scale: scaledSize}]}]}>
            <Image style={styles.target_image} source={{
                uri: props.data.item.url,
            }}/>
        </Animated.View>
    );
    
}

export default DraggableTarget;