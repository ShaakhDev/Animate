import { StyleSheet, Text, TextProps, View } from 'react-native';
import Animated, {
  FadeOutDown,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface TickerProps {
  value?: number;
  fontSize?: number;
}

type TickerListProps = {
  number: number;
};

function Tick({
  children,
  fontSize,
  style,
  ...rest
}: TextProps & { fontSize: number }) {
  return (
    <Text
      {...rest}
      style={[
        style,
        {
          fontSize: fontSize,
          lineHeight: fontSize * 1.1,
          fontVariant: ['tabular-nums'],
        },
      ]}
    >
      {children}
    </Text>
  );
}

const numbersToNice = [...Array(10).keys()];

function TickerList({
  number,
  fontSize,
}: TickerListProps & { fontSize: number }) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(-fontSize * 1.1 * number, {
            duration: 500,
            dampingRatio: 0.8,
            mass: 4,
            overshootClamping: false,
            energyThreshold: 6e-9,
            velocity: 0,
          }),
        },
      ],
    };
  });
  return (
    <View
      style={[
        styles.hidden,
        {
          height: fontSize,
        },
      ]}
    >
      <Animated.View exiting={FadeOutDown.duration(200)} style={animatedStyle}>
        {numbersToNice.map((num, index) => {
          return (
            <Tick
              key={`number-${num}-${index}`}
              fontSize={fontSize}
              style={styles.tickerText}
            >
              {num}
            </Tick>
          );
        })}
      </Animated.View>
    </View>
  );
}

function Ticker({ value = 1234, fontSize = 50 }: TickerProps) {
  const splitValue = value.toString().split('');
  return (
    <View>
      <View style={styles.container}>
        {splitValue.map((number, index) => (
          <TickerList
            fontSize={fontSize}
            number={parseInt(number, 10)}
            key={index}
          />
        ))}
        <Text style={styles.tickerText}>%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hidden: {
    overflow: 'hidden',
  },
  fallen: {
    position: 'absolute',
    left: 100000,
    top: 100000,
  },
  tickerText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 10,
    lineHeight: 10 * 1.1,
  },
});

export default Ticker;
