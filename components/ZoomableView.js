import { Animated } from "react-native";
import { PinchGestureHandler, PanGestureHandler, GestureHandlerRootView, State } from "react-native-gesture-handler";
import { styles } from "../utilities/CustomStyles";
import { Shared } from "../utilities/Shared";


const ZoomableView = ({children, style, onLayout}) => {
    const focalX = new Animated.Value(0);
    const focalY = new Animated.Value(0);

    const baseScale = new Animated.Value(Shared.lastScale);
    const pinchScale = new Animated.Value(1);
    const scale = Animated.multiply(baseScale, pinchScale);

    const basePanX = new Animated.Value(Shared.lastPanX);
    const basePanY = new Animated.Value(Shared.lastPanY);
    const activePanX = new Animated.Value(0);
    const activePanY = new Animated.Value(0);
    const panX = Animated.subtract(Animated.add(basePanX, new Animated.divide(activePanX, scale)),
        focalX);
    const panY = Animated.subtract(Animated.add(basePanY, new Animated.divide(activePanY, scale)),
        focalY);
    let xdif = 0;
    let ydif = 0;

    const adjsutTranslate = () => {
        const panOffsetX = ((Shared.playAreaSize.width*(Shared.lastScale-1))/2)/Shared.lastScale;
        if(Shared.lastPanX < -panOffsetX) {Shared.lastPanX = -panOffsetX}
        else if(Shared.lastPanX > panOffsetX) {Shared.lastPanX = panOffsetX}

        const panOffsetY = ((Shared.playAreaSize.height*(Shared.lastScale-1))/2)/Shared.lastScale;
        if(Shared.lastPanY < -panOffsetY) {Shared.lastPanY = -panOffsetY}
        else if(Shared.lastPanY > panOffsetY) {Shared.lastPanY = panOffsetY}
        basePanX.setValue(Shared.lastPanX);
        basePanY.setValue(Shared.lastPanY);
        activePanX.setValue(0);
        activePanY.setValue(0);
    }

    const handlePan = (event) => { 
        if(Shared.lastScale > 1) {
            Animated.event(
            [{ nativeEvent: { translationX: activePanX, translationY: activePanY} }],
            { useNativeDriver: false })(event);
        }
    }

    const handlePanStateChange = (event) => {
        if (Shared.lastScale > 1 && event.nativeEvent.oldState === State.ACTIVE) {
            Shared.lastPanX += event.nativeEvent.translationX/Shared.lastScale;
            Shared.lastPanY += event.nativeEvent.translationY/Shared.lastScale;
            adjsutTranslate();
        }
    };

    const handlePinch = Animated.event(
            [{ nativeEvent: { scale: pinchScale } }],
            { useNativeDriver: false });
  
    const handlePinchStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
        xdif = event.nativeEvent.focalX - (Shared.playAreaSize.width/2 - Shared.lastPanX);
        if(Math.abs(xdif) > 2) {
            Animated.timing(
                focalX,
                {toValue:xdif, useNativeDriver: false}
            ).start();
        }

        ydif = event.nativeEvent.focalY - (Shared.playAreaSize.height/2 - Shared.lastPanY);
        if(Math.abs(ydif) > 2) {
            Animated.timing(
                focalY,
                {toValue:ydif, useNativeDriver: false}
            ).start();
        }
    }
    if (event.nativeEvent.oldState === State.ACTIVE) {
        Shared.lastScale *= event.nativeEvent.scale;
        if(Shared.lastScale < 1) {Shared.lastScale = 1}
        else if(Shared.lastScale > 2) {Shared.lastScale = 2} 
        baseScale.setValue(Shared.lastScale);
        pinchScale.setValue(1);
       
        Shared.lastPanX -= xdif;
        Shared.lastPanY -= ydif;
        focalX.setValue(0);
        focalY.setValue(0);
        xdif = 0;
        ydif = 0;
        adjsutTranslate();
    }
    };

    return (
        <GestureHandlerRootView style={[style, {overflow: 'hidden'}]} onLayout={onLayout}>
            <PanGestureHandler onGestureEvent={handlePan} onHandlerStateChange={handlePanStateChange}>
                <PinchGestureHandler onGestureEvent={handlePinch} onHandlerStateChange={handlePinchStateChange}>
                    <Animated.View style={[styles.container,
                    {transform: [{scale: scale}, {translateX: panX}, {translateY: panY}]}]}>
                        {children}
                    </Animated.View>
                </PinchGestureHandler>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}

export default ZoomableView;