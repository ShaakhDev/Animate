import { ScrollView, StyleSheet } from 'react-native';
import ScheduleDay from '@/components/ScheduleDay';

const WeekDays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const ScheduleScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {WeekDays.map(day => (
        <ScheduleDay key={day} day={day} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
});
