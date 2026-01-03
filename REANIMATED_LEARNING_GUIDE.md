# React Native Reanimated - Learning Journey

## Table of Contents

1. [Progress Bar Animation](#1-progress-bar-animation)
2. [Ticker Animation](#2-ticker-animation)
3. [Schedule Day Layout Animations](#3-schedule-day-layout-animations)
4. [Radial Progress Animation](#4-radial-progress-animation)
5. [Parallax Carousel with Scroll](#5-parallax-carousel-with-scroll)
6. [Animated Logo with Gyroscope](#6-animated-logo-with-gyroscope)
7. [Key Concepts Summary](#key-concepts-summary)

---

## 1. Progress Bar Animation

**File:** `src/components/ProgressBar/ProgressBar.tsx`

### What It Does

A smooth animated progress bar that fills horizontally as the progress value increases. It includes a ticker that counts up and shows "UPLOADED" when complete.

### Key Concepts Learned

#### 🔑 `useAnimatedStyle`

This is the fundamental hook for animating styles in Reanimated. It creates styles that can be animated on the UI thread (not the JavaScript thread).

```typescript
const animatedStyle = useAnimatedStyle(() => {
  return {
    width: withSpring(`${progress}%`, {
      duration: 500,
      dampingRatio: 0.8,
      mass: 3,
    }),
  };
});
```

**Key Learning:**

- Returns an object with animated style properties
- Runs on the UI thread for 60 FPS performance
- Must be wrapped in a function that returns the style object

#### 🔑 `withSpring`

A spring-based animation that creates natural, physics-based motion.

**Parameters I learned:**

- `duration`: How long the animation takes
- `dampingRatio`: Controls the bounciness (0.8 means less bouncy)
- `mass`: Simulates weight (higher = slower to move)

**Key Learning:** Spring animations feel more natural than linear animations. They're great for UI that should feel responsive and alive.

#### 🔑 `FadeInDown`

A predefined entering animation that fades in while sliding down.

```typescript
<Animated.Text entering={FadeInDown.duration(200)} style={styles.completedText}>
  UPLOADED
</Animated.Text>
```

**Key Learning:**

- Entering animations automatically play when a component mounts
- Can be chained with modifiers like `.duration()` to customize behavior
- Great for simple entrance effects without writing custom animation code

### What I Learned

1. **Animated.View** is used instead of regular View for animated components
2. The animation runs entirely on the UI thread - no JavaScript bridge delays!
3. Spring animations create more natural motion than timing-based animations
4. Entering animations are declarative and easy to use

---

## 2. Ticker Animation

**File:** `src/components/Ticker/Ticker.tsx`

### What It Does

Creates a rolling number effect where digits "scroll" vertically to change values, like an odometer or slot machine.

### Key Concepts Learned

#### 🔑 Vertical Translation with `translateY`

```typescript
const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [
      {
        translateY: withSpring(-fontSize * 1.1 * number, {
          duration: 500,
          dampingRatio: 0.8,
          mass: 4,
        }),
      },
    ],
  };
});
```

**Key Learning:**

- `translateY` moves elements vertically (negative = up, positive = down)
- Calculated as `-fontSize * lineHeight * digitValue`
- Creates the "scrolling numbers" effect by moving a column of digits

#### 🔑 Overflow Hidden Pattern

```typescript
<View style={[styles.hidden, { height: fontSize }]}>
  <Animated.View style={animatedStyle}>
    {/* All 10 digits rendered here */}
  </Animated.View>
</View>
```

```css
hidden: {
  overflow: 'hidden';
}
```

**Key Learning:**

- Parent container has `overflow: hidden` to act as a "window"
- Only shows one digit at a time through the window
- The animated child moves up/down behind the mask

#### 🔑 `FadeOutDown`

Used for exit animations when the component unmounts.

```typescript
<Animated.View exiting={FadeOutDown.duration(200)} style={animatedStyle}>
```

**Key Learning:**

- `exiting` prop handles unmount animations
- Opposite of `entering` animations
- Component stays visible during the exit animation before being removed

### What I Learned

1. **Transform animations** (translate, rotate, scale) are very performant
2. The "window + moving content" pattern is powerful for scrolling effects
3. Pre-rendering all possible states (0-9 digits) and moving them is more efficient than changing the content
4. `fontVariant: ['tabular-nums']` keeps digit widths consistent (important for number animations)

---

## 3. Schedule Day Layout Animations

**File:** `src/components/ScheduleDay/ScheduleDay.tsx`

### What It Does

Animated accordion that expands/collapses to show time slots. Items animate in when added and out when removed, with smooth layout transitions.

### Key Concepts Learned

#### 🔑 `LinearTransition`

Automatically animates layout changes when components move, resize, or reorder.

```typescript
const _layout = LinearTransition.springify().damping(80);

<Animated.View layout={_layout} style={styles.container}>
  {/* Content that changes size/position */}
</Animated.View>;
```

**Key Learning:**

- The `layout` prop handles automatic position/size animations
- `.springify()` makes it use spring physics instead of linear motion
- Perfect for lists, accordions, and dynamic layouts
- No manual position calculations needed!

#### 🔑 Combining Entering, Exiting, and Layout

```typescript
<Animated.View
  entering={FadeInDown.springify().damping(80)}
  exiting={FadeOut.springify().damping(80)}
  layout={LinearTransition.springify().damping(80)}
  key={time.id}
>
```

**Key Learning:**

- Can combine all three animation types on one component
- `entering` = mount animation
- `exiting` = unmount animation
- `layout` = position/size change animation
- The `key` prop is crucial for React to track which items are being added/removed

#### 🔑 Shared Animation Configuration

```typescript
const _damping = 80;
const _entering = FadeInDown.springify().damping(_damping);
const _exiting = FadeOut.springify().damping(_damping);
const _layout = LinearTransition.springify().damping(_damping);
```

**Key Learning:**

- Reuse animation configurations for consistency
- Keeping damping values the same creates a cohesive feel
- More maintainable than repeating animation code everywhere

#### 🔑 Array Animations with `useFieldArray`

Works seamlessly with form libraries (React Hook Form) to animate dynamic lists.

**Key Learning:**

- Layout animations work great with dynamic arrays
- Each item needs a unique, stable `key` prop
- Reanimated handles the rest automatically

### What I Learned

1. **Layout animations are magical** - they automatically animate changes without manual calculations
2. Consistent animation timing across all elements creates a polished feel
3. The `.springify()` modifier makes any animation use spring physics
4. Good for: accordions, expanding menus, todo lists, dynamic forms
5. The key to smooth list animations is proper `key` management

---

## 4. Radial Progress Animation

**File:** `src/components/RadialProgress/RadialProgress.tsx`

### What It Does

A circular progress indicator made of radial "ticks" that grow and light up as progress increases. Includes percentage counter and complex SVG animations.

### Key Concepts Learned

#### 🔑 `useSharedValue`

Creates a value that can be shared between the UI thread and JS thread.

```typescript
const animatedProgress = useSharedValue(progress / 100);
```

**Key Learning:**

- Unlike React state, changes don't trigger re-renders
- Can be read and written from animation worklets
- Essential for high-performance animations
- Initial value is set on creation

#### 🔑 `withTiming`

Frame-by-frame animation with custom easing curves.

```typescript
animatedProgress.value = withTiming(progress / 100, {
  duration: animationDuration,
  easing: Easing.bezier(0.79, 0.41, 0.45, 0.78),
  reduceMotion: ReduceMotion.System,
});
```

**Key Learning:**

- More controlled than `withSpring`
- `Easing.bezier()` creates custom curves (like CSS cubic-bezier)
- `reduceMotion: ReduceMotion.System` respects accessibility settings
- Updates are assigned directly to `.value` property

#### 🔑 `useAnimatedProps`

Like `useAnimatedStyle` but for non-style props (SVG attributes, custom component props).

```typescript
const animatedProps = useAnimatedProps(() => {
  const progressValue = animatedProgress.value;

  let height: number;
  let opacity: number;

  if (isFullyActive) {
    height = activeTickHeight;
    opacity = 1;
  } else if (isTransitioning) {
    height = interpolate(
      progressValue,
      [tickThreshold, nextTickThreshold],
      [inactiveTickHeight + 10, activeTickHeight],
    );
    opacity = interpolate(/* ... */);
  }

  return {
    opacity,
    height,
    y: innerY - height,
    fill: isActive ? activeColor : inactiveColor,
  };
});

<AnimatedRect animatedProps={animatedProps} />;
```

**Key Learning:**

- Used to animate SVG attributes: `x`, `y`, `width`, `height`, `fill`, `opacity`, etc.
- Must create animated component first: `Animated.createAnimatedComponent(Rect)`
- Perfect for complex SVG animations
- Returns an object of prop names and animated values

#### 🔑 `interpolate`

Maps an input range to an output range - the heart of custom animations.

```typescript
height = interpolate(
  progressValue, // Input value
  [tickThreshold, nextTickThreshold], // Input range
  [inactiveTickHeight, activeTickHeight], // Output range
  Extrapolation.CLAMP, // Edge behavior
);
```

**Key Learning:**

- Takes a value and maps it from one range to another
- Input/output ranges can be any numeric values
- `Extrapolation.CLAMP` prevents values from going outside the output range
- `Extrapolation.EXTEND` allows values to continue the pattern beyond the range

#### 🔑 `useDerivedValue`

Computes a value based on other shared values, automatically updates when dependencies change.

```typescript
const animatedPercent = useDerivedValue(() => {
  return Math.floor(animatedProgress.value * 100);
});
```

**Key Learning:**

- Like `useMemo` but for animated values
- Runs on the UI thread
- Automatically tracks dependencies (shared values used inside)
- Result is also a shared value that can be used in other animations

#### 🔑 `useAnimatedReaction`

Watches for changes in animated values and triggers side effects.

```typescript
useAnimatedReaction(
  () => animatedPercent.value, // What to watch
  (current, previous) => {
    // What to do when it changes
    if (current !== previous) {
      runOnJS(setDisplayedPercent)(current);
    }
  },
);
```

**Key Learning:**

- First function: return the value to watch
- Second function: runs when that value changes
- `runOnJS()` is required to call JavaScript functions from the UI thread
- Perfect for syncing animated values with React state

#### 🔑 `runOnJS`

Bridges from UI thread back to JavaScript thread.

```typescript
runOnJS(setDisplayedPercent)(current);
```

**Key Learning:**

- Wraps regular JavaScript functions so they can be called from worklets
- Necessary because animations run on UI thread, React state is on JS thread
- Format: `runOnJS(functionName)(arguments)`
- Use sparingly - crossing threads has performance cost

#### 🔑 Animated SVG Components

```typescript
const AnimatedRect = Animated.createAnimatedComponent(Rect);
```

**Key Learning:**

- React Native Reanimated doesn't animate SVG components by default
- Must wrap them with `createAnimatedComponent`
- Then use `animatedProps` to animate SVG attributes
- Works with any custom component, not just SVG

### What I Learned

1. **Shared values are the backbone** of complex animations
2. **`interpolate` is incredibly powerful** - can map any numeric relationship
3. **UI thread vs JS thread** - animations run on UI thread for smoothness
4. **`useDerivedValue`** prevents redundant calculations
5. **`useAnimatedReaction`** bridges animated world to React world
6. SVG animations require special handling but enable rich visual effects
7. Complex animations are built from simple primitives (interpolate, derived values, etc.)

---

## 5. Parallax Carousel with Scroll

**File:** `src/screens/ParallaxCarousel.tsx`

### What It Does

A horizontal scrolling carousel where items rotate in 3D space based on scroll position and device tilt (gyroscope). Creates a depth effect with transforms.

### Key Concepts Learned

#### 🔑 `useAnimatedScrollHandler`

Tracks scroll position and runs animations based on scrolling.

```typescript
const scrollX = useSharedValue(0);

const scrollHandler = useAnimatedScrollHandler({
  onScroll: event => {
    scrollX.value = event.contentOffset.x;
  },
});

<Animated.FlatList onScroll={scrollHandler} scrollEventThrottle={16} />;
```

**Key Learning:**

- Captures scroll events on the UI thread (no bridge delay!)
- `event.contentOffset.x` for horizontal scroll
- `event.contentOffset.y` for vertical scroll
- `scrollEventThrottle={16}` = 60fps (16ms per frame)
- Updates shared value continuously as user scrolls

#### 🔑 3D Transforms

```typescript
transform: [
  { perspective: 500 },
  { rotateY: `${rotateY}rad` },
  { rotateX: `${rotateX}rad` },
  { rotateZ: `${rotateZ}deg` },
];
```

**Key Learning:**

- `perspective` must come first - defines 3D depth (lower = more extreme)
- `rotateX` = tilt forward/backward
- `rotateY` = turn left/right
- `rotateZ` = spin clockwise/counterclockwise
- Use radians for X/Y, degrees for Z (convention)
- Order matters! Different orders create different effects

#### 🔑 Scroll-Based Animations with Input Ranges

```typescript
const inputRange = [
  (index - 1) * (ITEM_WIDTH + SPACING), // Previous item position
  index * (ITEM_WIDTH + SPACING), // Current item position
  (index + 1) * (ITEM_WIDTH + SPACING), // Next item position
];

const rotateZ = interpolate(
  scrollX.value,
  inputRange,
  [10, 0, -10], // Rotations: tilted right → flat → tilted left
  Extrapolation.CLAMP,
);
```

**Key Learning:**

- Each carousel item has its own input range based on its position
- As scroll position moves through the range, item animates
- Before range: item is tilted right (previous)
- In range: item becomes flat (centered)
- After range: item tilts left (next)
- Creates the "active item is centered" effect

#### 🔑 `useAnimatedSensor`

Access device sensors (gyroscope, accelerometer) in animations.

```typescript
const deviceRotation = useAnimatedSensor(SensorType.ROTATION, {
  interval: 20, // Update every 20ms
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
```

**Key Learning:**

- `SensorType.ROTATION` for gyroscope (device tilt)
- `SensorType.GRAVITY` for accelerometer (gravity direction)
- Returns a shared value that updates automatically
- `sensor.value` contains: `{ pitch, roll, yaw }` or `{ x, y, z }`
- `interval` controls update frequency (lower = more updates = smoother but more CPU)

#### 🔑 Combining Multiple Animations

```typescript
const rotateY = interpolate(scrollX.value, inputRange, [
  0,
  rotationY.value, // Device tilt only affects centered item
  0,
]);
```

**Key Learning:**

- Can nest animated values inside interpolations
- Combines scroll position AND device tilt
- Only the centered item responds to tilt
- Creates interactive, multi-dimensional effects

#### 🔑 Z-Index Animation

```typescript
const zIndex = Math.ceil(
  interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP),
);

return {
  zIndex,
  elevation: zIndex, // For Android
};
```

**Key Learning:**

- Can animate `zIndex` to control layer order
- `Math.ceil()` ensures whole numbers (zIndex doesn't support decimals)
- Centered item gets higher zIndex so it appears on top
- `elevation` is Android's equivalent of zIndex

### What I Learned

1. **Scroll animations are surprisingly easy** with `useAnimatedScrollHandler`
2. **Input ranges are position-relative** - each item has different ranges
3. **3D transforms create depth** - perspective is key
4. **Sensors add physical interaction** - device tilt affects UI
5. **Combining multiple animation sources** (scroll + sensors) creates rich experiences
6. **Z-index animation** helps with layering in 3D space
7. **FlatList performance** - `removeClippedSubviews={false}` prevents animation glitches

---

## 6. Animated Logo with Gyroscope

**File:** `src/screens/AnimatedLogo.tsx`

### What It Does

A 3D React Native logo that tilts based on device orientation. Combines Reanimated with Skia for GPU-accelerated graphics with dynamic shadows.

### Key Concepts Learned

#### 🔑 Advanced Sensor Integration

```typescript
const deviceRotation = useAnimatedSensor(SensorType.ROTATION, {
  interval: 20,
});
const rotationGravity = useAnimatedSensor(SensorType.GRAVITY, {
  interval: 20,
});

const rotateY = useDerivedValue(() => {
  const { roll } = deviceRotation.sensor.value;
  return interpolate(
    roll,
    [-1, 0, 1],
    [Math.PI / 8, 0, -Math.PI / 8],
    Extrapolation.CLAMP,
  );
});

const rotateX = useDerivedValue(() => {
  const { z } = rotationGravity.sensor.value;
  return interpolate(
    z,
    [-9, -6, -1],
    [-Math.PI / 8, 0, Math.PI / 8],
    Extrapolation.CLAMP,
  );
});
```

**Key Learning:**

- `SensorType.ROTATION` gives device orientation (roll, pitch, yaw)
- `SensorType.GRAVITY` gives gravity direction (useful for "natural" tilt)
- Different sensors provide different data - choose based on desired effect
- Gravity values are in m/s² (~-9.8 for Earth's gravity)
- Roll = side-to-side tilt, affects Y rotation
- Z gravity = forward/backward tilt, affects X rotation

#### 🔑 Dynamic Transform Objects

```typescript
const rTransform = useDerivedValue(() => {
  return [
    { perspective: 200 },
    { rotateY: rotateY.value },
    { rotateX: rotateX.value },
  ];
});

<Group origin={CanvasCenter} transform={rTransform}>
```

**Key Learning:**

- Can pass entire transform array as animated value
- Updates all transforms together
- More efficient than animating each property separately
- Works with Skia's transform system

#### 🔑 Dynamic Shadows

```typescript
const shadowDx = useDerivedValue(() => {
  return interpolate(
    rotateY.value,
    [-Math.PI / 8, 0, Math.PI / 8],
    [10, 0, -10],
    Extrapolation.CLAMP,
  );
});

const shadowDy = useDerivedValue(() => {
  return interpolate(
    rotateX.value,
    [-Math.PI / 8, 0, Math.PI / 8],
    [7, 0, 10],
    Extrapolation.CLAMP,
  );
});

<Shadow color="#000000" blur={3.5} dx={shadowDx} dy={shadowDy} />;
```

**Key Learning:**

- Shadows can respond to rotation to simulate light source
- `dx` = horizontal shadow offset (follows Y rotation)
- `dy` = vertical shadow offset (follows X rotation)
- Asymmetric values (`[7, 0, 10]`) simulate top-down lighting
- Creates realistic 3D depth cues

#### 🔑 Integration with Skia

Reanimated shared values work directly with Skia's GPU-accelerated rendering.

**Key Learning:**

- Skia renders on GPU for maximum performance
- Reanimated shared values update Skia properties
- Perfect for complex graphics + animations
- Radial gradients, blur effects, shadows all GPU-accelerated

### What I Learned

1. **Multiple sensors can work together** for rich interactions
2. **Shadows enhance 3D perception** - dynamic shadows are crucial
3. **Gravity sensor feels more natural** than pure gyroscope for tilt
4. **Transform origin matters** - set it to center for rotation
5. **Skia + Reanimated = powerful combo** for graphics
6. **Asymmetric interpolation ranges** create more realistic effects
7. **Lower perspective values** = more extreme 3D effect

---

## Key Concepts Summary

### Core Hooks & Functions

| Hook/Function              | Purpose                   | When to Use                        |
| -------------------------- | ------------------------- | ---------------------------------- |
| `useSharedValue`           | Create animated value     | Starting point for all animations  |
| `useAnimatedStyle`         | Animate View styles       | 95% of style animations            |
| `useAnimatedProps`         | Animate non-style props   | SVG attributes, custom props       |
| `useDerivedValue`          | Compute from other values | Dependent calculations             |
| `useAnimatedReaction`      | React to value changes    | Sync with React state              |
| `useAnimatedScrollHandler` | Handle scroll events      | Scroll-based animations            |
| `useAnimatedSensor`        | Access device sensors     | Gyroscope, accelerometer effects   |
| `interpolate`              | Map value ranges          | Transform numeric values           |
| `withSpring`               | Spring physics animation  | Natural, bouncy motion             |
| `withTiming`               | Time-based animation      | Controlled, predictable motion     |
| `runOnJS`                  | Call JS from UI thread    | Update React state from animations |

### Animation Modifiers

| Modifier       | Purpose                | Example                        |
| -------------- | ---------------------- | ------------------------------ |
| `entering`     | Mount animation        | `entering={FadeIn}`            |
| `exiting`      | Unmount animation      | `exiting={FadeOut}`            |
| `layout`       | Position/size change   | `layout={LinearTransition}`    |
| `.duration()`  | Set animation duration | `FadeIn.duration(300)`         |
| `.springify()` | Use spring physics     | `LinearTransition.springify()` |
| `.damping()`   | Control bounciness     | `.damping(80)`                 |

### Performance Tips I Learned

1. **Animations run on UI thread** - No JavaScript bridge delays
2. **Use worklets** - Functions in `useAnimatedStyle` run on UI thread
3. **Avoid `runOnJS`** when possible - Crossing threads is expensive
4. **Share animation configs** - Reuse for consistency and maintainability
5. **Use `scrollEventThrottle={16}`** for 60fps scroll animations
6. **`interpolate` is free** - No performance cost for calculations on UI thread
7. **Layout animations are magic** - Let Reanimated handle position/size changes

### Common Patterns

#### 1. Basic Style Animation

```typescript
const animatedStyle = useAnimatedStyle(() => ({
  opacity: withSpring(visible ? 1 : 0),
}));
```

#### 2. Scroll-Based Effect

```typescript
const scrollX = useSharedValue(0);
const scrollHandler = useAnimatedScrollHandler({
  onScroll: e => (scrollX.value = e.contentOffset.x),
});
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: scrollX.value * 0.5 }],
}));
```

#### 3. Gesture Response

```typescript
const translateX = useSharedValue(0);
const gesture = Gesture.Pan()
  .onChange(e => (translateX.value += e.changeX))
  .onEnd(() => (translateX.value = withSpring(0)));
```

#### 4. List Item Animation

```typescript
<Animated.View
  entering={FadeInDown}
  exiting={FadeOut}
  layout={LinearTransition}
/>
```

#### 5. Sensor-Based Tilt

```typescript
const rotation = useAnimatedSensor(SensorType.ROTATION);
const tilt = useDerivedValue(() => rotation.sensor.value.roll);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ rotateZ: `${tilt.value}rad` }],
}));
```

---

## Final Thoughts

After building these animations, here are my biggest takeaways:

1. **Start Simple** - `useAnimatedStyle` + `withSpring` gets you 80% of the way
2. **UI Thread is Magic** - 60fps animations without thinking about performance
3. **Layout Animations Save Time** - `layout` prop eliminates manual calculations
4. **Interpolate is Your Friend** - Master this and you can create any animation
5. **Sensors Add Polish** - Device tilt/rotation makes apps feel alive
6. **SVG + Reanimated = Beautiful** - Complex graphics become animated easily
7. **Read the Docs** - Reanimated has many built-in animations (Fade, Slide, Zoom, etc.)

### Next Steps to Deepen Learning

- ✅ Gestures with `react-native-gesture-handler`
- ✅ Shared element transitions
- ✅ Custom entering/exiting animations
- ✅ Advanced Skia + Reanimated integrations
- ✅ Combining multiple gesture handlers
- ✅ Performance optimization techniques

---

**Created:** As a learning resource after building 6+ animations with React Native Reanimated  
**Purpose:** Document the learning journey from beginner to intermediate Reanimated developer
