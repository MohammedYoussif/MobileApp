import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  ImageSourcePropType,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const INTRO_COMPLETED_KEY = "introCompleted";

// Component for a single slide
const Slide = ({
  item,
  index,
  scrollX,
}: {
  item: {
    mainImage: ImageSourcePropType;
    title: string;
    subtitle: string;
    id: string;
  };
  index: number;
  scrollX: Animated.Value;
}) => {
  // Calculate the input range for animations
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  // Create animated values for different properties
  const imageScale = scrollX.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8],
    extrapolate: "clamp",
  });

  const textOpacity = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: "clamp",
  });

  const textTranslateY = scrollX.interpolate({
    inputRange,
    outputRange: [40, 0, 40],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.slide}>
      <Animated.View style={{ transform: [{ scale: imageScale }] }}>
        <Image
          source={item.mainImage}
          style={styles.mainImage}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        <ThemedText type="bold" style={styles.title}>
          {item.title}
        </ThemedText>
        <ThemedText type="medium" style={styles.subtitle}>
          {item.subtitle}
        </ThemedText>
      </Animated.View>
    </View>
  );
};

// Pagination component
const Pagination = ({
  slides,
  scrollX,
}: {
  slides: {
    mainImage: ImageSourcePropType;
    title: string;
    subtitle: string;
    id: string;
  }[];
  scrollX: Animated.Value;
}) => {
  return (
    <View style={styles.paginationContainer}>
      {slides.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.paginationDot,
              { width: dotWidth, opacity },
              scrollX.interpolate({
                inputRange,
                outputRange: [
                  styles.paginationDot.backgroundColor,
                  styles.paginationDotActive.backgroundColor,
                  styles.paginationDot.backgroundColor,
                ],
                extrapolate: "clamp",
              })
                ? styles.paginationDotActive
                : null,
            ]}
          />
        );
      })}
    </View>
  );
};

// IntroSlider component
const IntroSlider = ({ onComplete }: { onComplete: () => void }) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const slides = [
    {
      id: "1",
      mainImage: require("@/assets/images/central-image-1.png"),
      title: t("intro.slide-1.title"),
      subtitle: t("intro.slide-1.subtitle"),
    },
    {
      id: "2",
      mainImage: require("@/assets/images/central-image-2.png"),
      title: t("intro.slide-2.title"),
      subtitle: t("intro.slide-2.subtitle"),
    },
    {
      id: "3",
      mainImage: require("@/assets/images/central-image-3.png"),
      title: t("intro.slide-3.title"),
      subtitle: t("intro.slide-3.subtitle"),
    },
  ];

  const handleNextPress = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkipPress = async () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem(INTRO_COMPLETED_KEY, "true");
      onComplete();
    } catch (error) {
      console.error("Error saving intro completion status:", error);
    }
  };

  const handleViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(slides.indexOf(viewableItems[0].item));
    }
  };

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  // Animated button scale for better feedback
  const buttonScale = useRef(new Animated.Value(1)).current;

  const buttonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const buttonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Animated.FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item, index }) => (
          <Slide item={item} index={index} scrollX={scrollX} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      />
      <View style={styles.footer}>
        <Pagination slides={slides} scrollX={scrollX} />
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNextPress}
            onPressIn={buttonPressIn}
            onPressOut={buttonPressOut}
          >
            <ThemedText type="bold" style={styles.nextButtonText}>
              {currentIndex !== 2 ? t("buttons.next") : t("buttons.done")}
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>
        {currentIndex !== 2 && (
          <TouchableOpacity style={styles.skipButton} onPress={handleSkipPress}>
            <ThemedText style={styles.skipButtonText}>
              {t("buttons.skip")}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// LoadingScreen component
const LoadingScreen = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={["#B38051", "#B3805190", "#B3805180"]}
      style={styles.loadingContainer}
    >
      <Animated.View
        style={[
          {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          alt="Logo"
          source={require("@/assets/images/icon.png")}
          style={{ width: "50%", height: 120, resizeMode: "contain" }}
        />
        <MaskedView
          maskElement={
            <ThemedText type="bold" style={{ fontSize: 30 }}>
              BExpo
            </ThemedText>
          }
        >
          <LinearGradient
            colors={["#B38051", "#B3805170", "#fff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: 90, height: 100 }}
          />
        </MaskedView>
      </Animated.View>
    </LinearGradient>
  );
};

// Main component that handles the flow
export default function IntroModule() {
  const { replace } = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if intro has been completed when component mounts
    checkIntroStatus();
  }, []);

  const checkIntroStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(INTRO_COMPLETED_KEY);
      if (value === "true") {
        setTimeout(() => {
          navigateToAuth();
        }, 7000);
      } else {
        setTimeout(() => {
          setIsLoading(false);
        }, 7000);
      }
    } catch (error) {
      console.error("Error checking intro status:", error);
      setTimeout(() => {
        setIsLoading(false);
      }, 7000);
    }
  };

  const handleIntroComplete = () => {
    navigateToAuth();
  };

  const navigateToAuth = () => {
    replace("/(auth)/(signin)");
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <IntroSlider onComplete={handleIntroComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    paddingVertical: 30,
  },
  mainImage: {
    width: width * 0.85,
    height: width * 0.85,
    maxWidth: 450,
    maxHeight: 450,
    marginTop: 30,
  },
  contentContainer: {
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#b48052",
  },
  nextButton: {
    width: width - 60,
    height: 50,
    backgroundColor: "#b48052",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  skipButton: {
    paddingVertical: 10,
  },
  skipButtonText: {
    color: "#999",
    fontSize: 14,
  },
});
