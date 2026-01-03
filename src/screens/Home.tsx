import { MainStackParamList } from '@/navigation/main-navigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<MainStackParamList, 'Home'>) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonsContainer}>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('ProgressBar')}
        >
          <Text style={styles.buttonText}>Progress Bar</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('RadialProgress')}
        >
          <Text style={styles.buttonText}>Radial Progress</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('Schedule')}
        >
          <Text style={styles.buttonText}>
            Schedule - Reanimated layout animation
          </Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('ParallaxCarousel')}
        >
          <Text style={styles.buttonText}>Parallax Carousel</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate('AnimatedLogo')}
        >
          <Text style={styles.buttonText}>Animated Logo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonsContainer: {
    flex: 1,
    gap: 10,
  },
  button: {
    padding: 10,
    backgroundColor: 'purple',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
