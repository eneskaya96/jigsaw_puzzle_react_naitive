import { useRef } from 'react';
import React,{
    PanResponder,
    Animated,
    Image,
} from 'react-native';
import { styles } from '../utilities/CustomStyles';
import { adjustPosition } from '../utilities/Methods';
import { Shared } from '../utilities/Shared';
import { PIECE_SIZE } from '../utilities/Constants';


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

            if(gesture.moveY > Shared.basePlayAreaSize.y + Shared.basePlayAreaSize.height && 
                gesture.moveY < Shared.basePlayAreaSize.y + Shared.basePlayAreaSize.height + PIECE_SIZE + 20) {
                props.dragdrop(gesture.moveX, 0, props.data.item, 1);
            }
        },
        onPanResponderRelease        : (e, gesture) => {
            const {x, y, status} = adjustPosition(gesture.moveX, gesture.moveY);
            if(status === 2) {
                const column = Math.floor(x / Shared.targetSize);
                const row = Math.floor(y / Shared.targetSize);
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
                    lastPanX = x - Shared.targetSize/2;
                    lastPanY = y - Shared.targetSize/2;
                }
                props.data.pos.x = lastPanX + Shared.targetSize/2;
                props.data.pos.y = lastPanY + Shared.targetSize/2;
                basePanX.setValue(lastPanX);
                basePanY.setValue(lastPanY);
                activePanX.setValue(0);
                activePanY.setValue(0);
            } else if(status === 0 || status === 1) {
                basePanX.setValue(props.data.pos.x - Shared.targetSize/2);
                basePanY.setValue(props.data.pos.y - Shared.targetSize/2);
                activePanX.setValue(0);
                activePanY.setValue(0);
                Animated.timing(
                    scaledSize,
                    {toValue:1, useNativeDriver: false}
                ).start();
            }
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