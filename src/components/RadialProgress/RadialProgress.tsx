import React, { useEffect, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  interpolate,
  SharedValue,
  Extrapolation,
  Easing,
  ReduceMotion,
  useDerivedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';
import { styles } from './RadialProgress.styles';

const AnimatedRect = Animated.createAnimatedComponent(Rect);

interface RadialProgressProps {
  progress?: number;
  size?: number;
  tickCount?: number;
  tickWidth?: number;
  activeTickHeight?: number;
  inactiveTickHeight?: number;
  innerRadius?: number;
  activeColor?: string;
  inactiveColor?: string;
  backgroundColor?: string;
  label?: string;
  labelColor?: string;
  percentColor?: string;
  animationDuration?: number;
}

interface TickProps {
  index: number;
  totalTicks: number;
  centerX: number;
  centerY: number;
  innerRadius: number;
  tickWidth: number;
  activeTickHeight: number;
  inactiveTickHeight: number;
  activeColor: string;
  inactiveColor: string;
  animatedProgress: SharedValue<number>;
}

const Tick: React.FC<TickProps> = ({
  index,
  totalTicks,
  centerX,
  centerY,
  innerRadius,
  tickWidth,
  activeTickHeight,
  inactiveTickHeight,
  activeColor,
  inactiveColor,
  animatedProgress,
}) => {
  // Calculate the angle for this tick (starting from top, going clockwise)
  const angle = (index / totalTicks) * 360 - 90;
  const angleRad = (angle * Math.PI) / 180;

  // Inner edge position (fixed point where ticks start from)
  const innerX = centerX + innerRadius * Math.cos(angleRad);
  const innerY = centerY + innerRadius * Math.sin(angleRad);

  // The threshold for this tick to be "active"
  const tickThreshold = index / totalTicks;
  const nextTickThreshold = (index + 1) / totalTicks;

  const animatedProps = useAnimatedProps(() => {
    const progressValue = animatedProgress.value;

    // Check if this tick is fully active, transitioning, or inactive
    const isFullyActive = progressValue >= nextTickThreshold;
    const isTransitioning =
      progressValue >= tickThreshold && progressValue < nextTickThreshold;
    const isActive = progressValue >= tickThreshold;

    // Calculate height based on state
    let height: number;
    let opacity: number;

    if (isFullyActive) {
      // Fully active tick - full height
      height = activeTickHeight;
      opacity = 1;
    } else if (isTransitioning) {
      // Transitioning tick - animate height from inactive to active
      height = interpolate(
        progressValue,
        [tickThreshold, nextTickThreshold],
        [inactiveTickHeight + 10, activeTickHeight],
      );
      opacity = interpolate(
        progressValue,
        [tickThreshold, nextTickThreshold],
        [0.9, 1],
        Extrapolation.CLAMP,
      );
    } else {
      // Inactive tick - animate height and opacity based on distance from progress
      height = inactiveTickHeight;
      opacity = 0.9;
    }

    return {
      opacity,
      height,
      y: innerY - height, // Adjust y so inner edge stays fixed, outer edge grows
      fill: isActive ? activeColor : inactiveColor,
    };
  });

  return (
    <AnimatedRect
      x={innerX - tickWidth / 2}
      y={innerY - activeTickHeight}
      width={tickWidth}
      height={activeTickHeight}
      rx={tickWidth / 2}
      ry={tickWidth / 2}
      transform={`rotate(${angle + 90}, ${innerX}, ${innerY})`}
      animatedProps={animatedProps}
    />
  );
};

function RadialProgress({
  progress = 99,
  size = 300,
  tickCount = 100,
  tickWidth = 4,
  activeTickHeight = 60,
  inactiveTickHeight = 35,
  innerRadius: customInnerRadius,
  activeColor = '#FFFFFF',
  inactiveColor = 'rgba(255, 255, 255, 0.5)',
  backgroundColor = '#A855F7',
  label = 'processing',
  animationDuration = 1000,
}: RadialProgressProps) {
  //   const [progressValue, setProgressValue] = useState(progress / 100);
  const [displayedPercent, setDisplayedPercent] = useState(
    Math.floor(progress),
  );
  const animatedProgress = useSharedValue(progress / 100);

  // Derive the percentage value from animated progress
  const animatedPercent = useDerivedValue(() => {
    return Math.floor(animatedProgress.value * 100);
  });

  // Update the displayed percentage as the animation progresses
  useAnimatedReaction(
    () => animatedPercent.value,
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setDisplayedPercent)(current);
      }
    },
  );

  const centerX = size / 2;
  const centerY = size / 2;

  // Inner radius is where ticks START (closer to center)
  const innerRadius = customInnerRadius ?? size / 2 - activeTickHeight - 10;

  useEffect(() => {
    animatedProgress.value = withTiming(progress / 100, {
      duration: animationDuration,
      easing: Easing.bezier(0.79, 0.41, 0.45, 0.78),
      reduceMotion: ReduceMotion.System,
    });
  }, [progress, animationDuration, animatedProgress]);

  const ticks = useMemo(
    () => Array.from({ length: tickCount }, (_, i) => i),
    [tickCount],
  );

  return (
    <View style={[styles.wrapper, { backgroundColor }]}>
      <View style={[styles.container, { width: size, height: size }]}>
        <MaskedView
          maskElement={
            <Svg width={size} height={size}>
              {ticks.map(index => (
                <Tick
                  key={index}
                  index={index}
                  totalTicks={tickCount}
                  centerX={centerX}
                  centerY={centerY}
                  innerRadius={innerRadius}
                  tickWidth={tickWidth}
                  activeTickHeight={activeTickHeight}
                  inactiveTickHeight={inactiveTickHeight}
                  activeColor={activeColor}
                  inactiveColor={inactiveColor}
                  animatedProgress={animatedProgress}
                />
              ))}
            </Svg>
          }
        >
          <Svg height={size} width={size}>
            <Defs>
              <RadialGradient id="0" gradientUnits="userSpaceOnUse">
                <Stop offset="55%" stopColor={backgroundColor} />
                <Stop offset="100%" stopColor={activeColor} />
              </RadialGradient>
            </Defs>
            <Rect fill="url(#0)" height={size} width={size} />
          </Svg>
        </MaskedView>

        <View style={styles.labelContainer}>
          <Text style={[styles.percentText, { color: activeColor }]}>
            {displayedPercent}%
          </Text>
          {label && (
            <Text style={[styles.labelText, { color: activeColor }]}>
              {label}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

export default RadialProgress;
