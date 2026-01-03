import { RadialProgress } from '@/components';
import { Pressable, StyleSheet } from 'react-native';
import { useState } from 'react';

const ColorPairs = [
  {
    activeColor: '#f1faee',
    backgroundColor: '#e63946',
  },
  {
    activeColor: '#fca311',
    backgroundColor: '#14213d',
  },
  {
    activeColor: '#3d405b',
    backgroundColor: '#f4f1de',
  },
  {
    activeColor: '#ee4266',
    backgroundColor: '#a5be00',
  },
  {
    activeColor: '#A855F7',
    backgroundColor: '#FFFFFF',
  },
  {
    activeColor: '#FFFFFF',
    backgroundColor: '#A855F7',
  },
];

export function RadialProgressScreen() {
  const [progress, setProgress] = useState(0);
  const [colorPair, setColorPair] = useState(ColorPairs[0]);
  const handlePress = () => {
    setProgress(Math.floor(Math.random() * 100));
    const randomColorPair =
      ColorPairs[Math.floor(Math.random() * ColorPairs.length)];
    setColorPair(randomColorPair);
  };
  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <RadialProgress
        progress={progress}
        animationDuration={1000}
        activeColor={colorPair.activeColor}
        backgroundColor={colorPair.backgroundColor}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
