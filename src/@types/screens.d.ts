import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {ParamListBase} from '@react-navigation/routers';

type ScreenRouteProp<T extends ParamListBase, D extends keyof T> = RouteProp<
  T,
  D
>;

type ScreenNavigationProp<
  T extends ParamListBase,
  D extends keyof T,
> = NativeStackNavigationProp<T, D>;

type ScreenProps<T extends ParamListBase, D extends keyof T> = {
  route: ScreenRouteProp<T, D>;
  navigation: ScreenNavigationProp<T, D>;
};
