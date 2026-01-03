import { ProgressBar } from '@/components';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ProgressBarScreen = () => {
  const [value, setValue] = useState(0);
  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar progress={value} />
      <View style={styles.buttonsContainer}>
        <Pressable
          style={styles.button}
          onPress={() => setValue(prev => Math.max(prev - 10, 0))}
        >
          <Text style={styles.buttonText}>-10</Text>
        </Pressable>
        <Pressable
          style={styles.button}
          onPress={() => setValue(prev => Math.min(prev + 10, 100))}
        >
          <Text style={styles.buttonText}>+10</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
