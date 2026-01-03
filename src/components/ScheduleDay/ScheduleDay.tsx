import { Pressable, Switch, Text, View } from 'react-native';
import { styles } from './ScheduleDay.styles';
import { useCallback } from 'react';
import Animated, {
  FadeInDown,
  FadeOut,
  LinearTransition,
} from 'react-native-reanimated';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react-native';
import { randomId } from '@/utils';
import { parse, format, addHours } from 'date-fns';

interface ScheduleDayProps {
  day: string;
}

const FormSchema = z
  .object({
    isActive: z.boolean(),
    times: z.array(
      z.object({
        id: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    ),
  })
  .strict();

type FormValues = z.infer<typeof FormSchema>;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const _damping = 80;
const _entering = FadeInDown.springify().damping(_damping);
const _exiting = FadeOut.springify().damping(_damping);
const _layout = LinearTransition.springify().damping(_damping);

function TimeRow({
  time,
  index,
  onRemoveTime,
}: {
  time: FormValues['times'][number];
  index: number;
  onRemoveTime: (index: number) => void;
}) {
  return (
    <Animated.View
      entering={_entering}
      exiting={_exiting}
      layout={_layout}
      key={time.id}
      style={styles.timeRow}
    >
      <Text style={styles.timeLabelText}>From</Text>
      <Text style={styles.timeValueText}>{time.startTime}</Text>
      <Text style={styles.timeLabelText}>To</Text>
      <Text style={styles.timeValueText}>{time.endTime}</Text>
      <Pressable
        style={styles.removeTimeButton}
        onPress={() => onRemoveTime(index)}
      >
        <X size={14} color="#333" />
      </Pressable>
    </Animated.View>
  );
}

function ScheduleDay({ day }: ScheduleDayProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      isActive: false,
      times: [{ id: '1', startTime: '08:00 AM', endTime: '09:00 AM' }],
    },
  });

  const timesArray = useFieldArray({
    control: form.control,
    name: 'times',
  });

  const onAddTime = () => {
    const lastTime = timesArray.fields[timesArray.fields.length - 1];
    const lastEndTime = lastTime ? lastTime.endTime : '08:00 AM';
    // Parse last end time as a date (using date-fns, assumed format: 'hh:mm a' i.e. '09:00 AM')
    const lastEndDate = parse(lastEndTime, 'hh:mm a', new Date());
    const newStartDate = lastEndDate;
    const newEndDate = addHours(newStartDate, 1);

    const newStartTime = format(newStartDate, 'hh:mm a');
    const newEndTime = format(newEndDate, 'hh:mm a');

    timesArray.append({
      id: randomId(),
      startTime: newStartTime,
      endTime: newEndTime,
    });
  };

  const onRemoveTime = useCallback(
    (index: number) => {
      timesArray.remove(index);
    },
    [timesArray],
  );

  return (
    <Animated.View
      layout={_layout}
      style={[styles.container, form.watch('isActive') && styles.openContainer]}
    >
      <View style={styles.dayHeader}>
        <Text style={styles.dayText}>{day}</Text>
        <View>
          <Controller
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <Switch
                value={field.value}
                onValueChange={field.onChange}
                thumbColor={'white'}
                trackColor={{ true: 'gray', false: 'lightgray' }}
                ios_backgroundColor={'lightgray'}
              />
            )}
          />
        </View>
      </View>
      {form.watch('isActive') && (
        <Animated.View
          entering={_entering}
          exiting={_exiting}
          layout={_layout}
          style={styles.timeContainer}
        >
          <View style={styles.timeContainer}>
            {timesArray?.fields?.map((time, index) => (
              <TimeRow
                key={time.id}
                time={time}
                index={index}
                onRemoveTime={onRemoveTime}
              />
            ))}
          </View>
          <AnimatedPressable
            layout={_layout}
            style={styles.addTimeButton}
            onPress={onAddTime}
          >
            <Text style={styles.addTimeButtonText}>+ Add more</Text>
          </AnimatedPressable>
        </Animated.View>
      )}
    </Animated.View>
  );
}

export default ScheduleDay;
