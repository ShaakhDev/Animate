import {
  HomeScreen,
  ProgressBarScreen,
  RadialProgressScreen,
  ScheduleScreen,
  ParallaxCarouselScreen,
  AnimatedLogoScreen,
  TickerScreen,
} from '@/screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type MainStackParamList = {
  Home: undefined;
  ProgressBar: undefined;
  Ticker: undefined;
  RadialProgress: undefined;
  Schedule: undefined;
  ParallaxCarousel: undefined;
  AnimatedLogo: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={HomeScreen}
      />
      <Stack.Screen name="ProgressBar" component={ProgressBarScreen} />
      <Stack.Screen name="Ticker" component={TickerScreen} />
      <Stack.Screen name="RadialProgress" component={RadialProgressScreen} />
      <Stack.Screen name="Schedule" component={ScheduleScreen} />
      <Stack.Screen
        name="ParallaxCarousel"
        component={ParallaxCarouselScreen}
      />
      <Stack.Screen name="AnimatedLogo" component={AnimatedLogoScreen} />
    </Stack.Navigator>
  );
};
