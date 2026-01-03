import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  withSpring,
  useAnimatedSensor,
  SensorType,
  useDerivedValue,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = 250;
const SPACING = 16;

const carouselData = [
  {
    id: 1,
    title: 'The Last of Us 2',
    image: require('@/assets/images/parallax-1.jpg'),
  },
  {
    id: 2,
    title: 'The Witcher',
    image: require('@/assets/images/parallax-2.jpg'),
  },
  {
    id: 3,
    title: 'The Legend of Zelda',
    image: require('@/assets/images/parallax-3.jpg'),
  },
  {
    id: 4,
    title: 'Super Mario Bros',
    image: require('@/assets/images/parallax-4.jpg'),
  },
  {
    id: 5,
    title: 'Mario Kart',
    image: require('@/assets/images/parallax-5.jpg'),
  },
  {
    id: 6,
    title: 'Pokemon',
    image: require('@/assets/images/parallax-6.jpg'),
  },
  {
    id: 7,
    title: 'Donkey Kong',
    image: require('@/assets/images/parallax-7.jpg'),
  },
  {
    id: 8,
    title: 'Kirby',
    image: require('@/assets/images/parallax-8.jpg'),
  },
  {
    id: 9,
    title: 'Sonic',
    image: require('@/assets/images/parallax-9.jpg'),
  },
  {
    id: 10,
    title: 'Metroid',
    image: require('@/assets/images/parallax-10.jpg'),
  },
];

const Item = ({
  item,
  index,
  scrollX,
}: {
  item: (typeof carouselData)[0];
  index: number;
  scrollX: SharedValue<number>;
}) => {
  const deviceRotation = useAnimatedSensor(SensorType.ROTATION, {
    interval: 20,
  });
  const rotationGravity = useAnimatedSensor(SensorType.GRAVITY, {
    interval: 20,
  });

  const rotationY = useDerivedValue(() => {
    const { roll } = deviceRotation.sensor.value;
    return interpolate(
      roll,
      [-1, 0, 1],
      [Math.PI / 8, 0, -Math.PI / 8],
      Extrapolation.CLAMP,
    );
  });

  const rotationX = useDerivedValue(() => {
    const { z } = rotationGravity.sensor.value;

    return interpolate(
      z,
      [-9, -6, -1],
      [Math.PI / 8, 0, -Math.PI / 8],
      Extrapolation.CLAMP,
    );
  });
  const animatedStyle = useAnimatedStyle(() => {
    // Calculate the input range for this item
    const inputRange = [
      (index - 1) * (ITEM_WIDTH + SPACING),
      index * (ITEM_WIDTH + SPACING),
      (index + 1) * (ITEM_WIDTH + SPACING),
    ];

    const rotateZ = interpolate(
      scrollX.value,
      inputRange,
      [10, 0, -10],
      Extrapolation.CLAMP,
    );

    const zIndex = Math.round(
      interpolate(scrollX.value, inputRange, [0, 99, 0], Extrapolation.CLAMP),
    );

    const rotateY = interpolate(scrollX.value, inputRange, [
      0,
      rotationY.value,
      0,
    ]);
    const rotateX = interpolate(scrollX.value, inputRange, [
      0,
      rotationX.value,
      0,
    ]);
    return {
      zIndex,
      transform: [
        { perspective: 500 },
        { rotateY: `${rotateY}rad` },
        { rotateX: `${rotateX}rad` },
        { rotateZ: `${rotateZ}deg` },
      ],
    };
  });

  const animatedBlurStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * (ITEM_WIDTH + SPACING),
      index * (ITEM_WIDTH + SPACING),
      (index + 1) * (ITEM_WIDTH + SPACING),
    ];

    const translateY = withSpring(
      interpolate(scrollX.value, inputRange, [60, 0, 60], Extrapolation.CLAMP),
      { duration: 200, dampingRatio: 1.2 },
    );
    return {
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={[styles.item, animatedStyle]}>
      <Image source={item.image} style={styles.image} />
      <Animated.View style={[styles.blur, animatedBlurStyle]}>
        <Text style={styles.blurText}>{item.title}</Text>
        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export const ParallaxCarouselScreen = () => {
  const scrollX = useSharedValue(0);

  return (
    <View style={styles.container}>
      <FlatList
        onScroll={event => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        style={styles.flatList}
        contentContainerStyle={styles.contentContainer}
        data={carouselData}
        keyExtractor={item => item?.id?.toString() ?? ''}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + SPACING}
        decelerationRate="fast"
        snapToAlignment="start"
        removeClippedSubviews={false}
        renderItem={({ item, index }) => (
          <Item item={item} index={index} scrollX={scrollX} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#042a2b',
    position: 'relative',
  },
  flatList: {
    flexGrow: 0,
    position: 'relative',
  },
  contentContainer: {
    paddingVertical: 100,
    paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2,
    gap: SPACING,
  },
  item: {
    width: ITEM_WIDTH,
    height: 350,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'cover',
  },
  blur: {
    position: 'absolute',
    height: 60,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
  blurText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dotsContainer: {
    marginTop: 'auto',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'white',
  },
});
