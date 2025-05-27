import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  snapPoints?: number[];
  children: (handleClose: () => void) => ReactNode | ReactNode[];
  containerStyle?: StyleProp<ViewStyle>;
  backdropOpacity?: number;
  enablePanDownToClose?: boolean;
  index?: number;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  isVisible,
  onClose,
  snapPoints = [SCREEN_HEIGHT * 0.5],
  children,
  containerStyle,
  backdropOpacity = 0.75,
  enablePanDownToClose = true,
  index = 0,
}) => {
  const backdropAnimatedValue = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const lastGestureDy = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        const newValue = lastGestureDy.current + gestureState.dy;
        if (newValue >= 0) {
          translateY.setValue(newValue);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentPosition = lastGestureDy.current + gestureState.dy;

        // Close if dragged down with sufficient velocity
        if (
          enablePanDownToClose &&
          (gestureState.vy > 1.2 || currentPosition > SCREEN_HEIGHT * 0.4)
        ) {
          handleClose();
          return;
        }

        // Find nearest snap point
        const snapHeights = snapPoints.map((point) => SCREEN_HEIGHT - point);
        let targetPosition = snapHeights[0];
        let minDistance = Math.abs(currentPosition - targetPosition);

        snapHeights.forEach((height) => {
          const distance = Math.abs(currentPosition - height);
          if (distance < minDistance) {
            minDistance = distance;
            targetPosition = height;
          }
        });

        // Animate to target position
        Animated.spring(translateY, {
          toValue: targetPosition,
          useNativeDriver: true,
          tension: 80,
          friction: 8,
        }).start();

        lastGestureDy.current = targetPosition;
      },
    })
  ).current;

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(backdropAnimatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      lastGestureDy.current = 0;
    });
  }, [backdropAnimatedValue, translateY, onClose]);

  useEffect(() => {
    if (isVisible) {
      const targetHeight = SCREEN_HEIGHT - (snapPoints[index] || snapPoints[0]);

      // Reset positions
      translateY.setValue(SCREEN_HEIGHT);
      backdropAnimatedValue.setValue(0);

      // Animate in
      Animated.parallel([
        Animated.timing(backdropAnimatedValue, {
          toValue: backdropOpacity,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(translateY, {
          toValue: targetHeight,
          useNativeDriver: true,
          tension: 80,
          friction: 8,
        }),
      ]).start(() => {
        lastGestureDy.current = targetHeight;
      });
    }
  }, [
    isVisible,
    snapPoints,
    index,
    backdropAnimatedValue,
    translateY,
    backdropOpacity,
  ]);

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      statusBarTranslucent
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropAnimatedValue,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Sheet Content */}
        <Animated.View
          style={[
            styles.sheet,
            containerStyle,
            {
              transform: [{ translateY }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />
          <View style={styles.contentContainer}>
            {typeof children === "function" ? children(handleClose) : children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheet: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#DEDEDE",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 8,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 32,
  },
});

export default BottomSheet;
