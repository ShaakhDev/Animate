import { View } from 'react-native';
import { StyleSheet } from 'react-native';
import Ticker from '../Ticker';
import Animated, {
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { useMemo } from 'react';

interface ProgressBarProps {
  progress: number;
}

function ProgressBar({ progress }: ProgressBarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${progress}%`, {
        duration: 500,
        dampingRatio: 0.8,
        mass: 3,
      }),
    };
  });

  const barAnimatedStyle = useMemo(() => {
    return {
      transitionProperty: 'backgroundColor',
      transitionDuration: 200,
      backgroundColor: '#200589',
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, animatedStyle, barAnimatedStyle]} />
      <View style={styles.tickerContainer}>
        {progress < 100 && <Ticker value={progress} fontSize={10} />}
      </View>
      <View style={styles.completedTextContainer}>
        {progress >= 100 && (
          <Animated.Text
            entering={FadeInDown.duration(200)}
            style={[styles.completedText]}
          >
            UPLOADED
          </Animated.Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 20,
    borderRadius: 8,
    boxSizing: 'border-box',
    backgroundColor: '#C4C4C4',
    overflow: 'hidden',
    position: 'relative',
  },
  bar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 20,
    width: '100%',
    backgroundColor: 'red',
  },
  tickerContainer: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: '-50%' }],
    left: 24,
  },
  completedTextContainer: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: '-50%' }],
    right: 24,
  },
  completedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  completedBar: {
    backgroundColor: 'green',
  },
});

export default ProgressBar;
