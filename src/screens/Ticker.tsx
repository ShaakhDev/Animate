import { Ticker } from '@/components';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const TickerScreen = () => {
  const [value, setValue] = useState<number>(1234);

  return (
    <View style={styles.container}>
      <Ticker value={value} fontSize={50} percentage={false} />
      <TouchableOpacity
        onPress={() => setValue(Math.floor(Math.random() * 10000))}
        style={styles.button}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Random</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },

  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
