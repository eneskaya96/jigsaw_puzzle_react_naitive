import { Animated, Image, View } from "react-native";
import { PinchGestureHandler, PanGestureHandler, GestureHandlerRootView, State } from "react-native-gesture-handler";
import { styles } from "../utilities/CustomStyles";
import { Shared } from "../utilities/Shared";


const ZoomableView = ({children, style, columnCount, showImage, imageUrl}) => {
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

    const handlePinch = (event) => { 
        if((Shared.lastScale*event.nativeEvent.scale)>=1 && 
            (Shared.lastScale*event.nativeEvent.scale)<=2) {
            Animated.event(
            [{ nativeEvent: { scale: pinchScale } }],
            { useNativeDriver: false })(event);
        }
    }
  
    const handlePinchStateChange = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
        xdif = event.nativeEvent.focalX - (Shared.basePlayAreaSize.width/2 - Shared.lastPanX);
        if(Math.abs(xdif) > 2) {
            Animated.timing(
                focalX,
                {toValue:xdif, useNativeDriver: false}
            ).start();
        }

        ydif = event.nativeEvent.focalY - (Shared.basePlayAreaSize.height/2 - Shared.lastPanY);
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
        <GestureHandlerRootView style={{flex: 1, overflow: 'visible'}}
        onLayout={event => {
            Shared.basePlayAreaSize = event.nativeEvent.layout;
        }}>
            <PanGestureHandler onGestureEvent={handlePan} onHandlerStateChange={handlePanStateChange}>
                <PinchGestureHandler onGestureEvent={handlePinch} onHandlerStateChange={handlePinchStateChange}>
                    <Animated.View style={
                    {flex: 1, transform: [{scale: scale}, {translateX: panX}, {translateY: panY}]}}>
                        <View style={[styles.play_area]}
                        onLayout={event => {
                            Shared.playAreaSize = event.nativeEvent.layout;
                            Shared.targetSize = Shared.playAreaSize.width / columnCount;
                        }}>
                        {!showImage && children}
                        <Image
                            style={{width: '100%', height: '100%', borderRadius: 10, opacity: showImage? 1: 0}}
                            source={{
                                uri: imageUrl,
                            }}
                        />
                        </View>
                    </Animated.View>
                </PinchGestureHandler>
            </PanGestureHandler>
        </GestureHandlerRootView>
    );
}

export default ZoomableView;