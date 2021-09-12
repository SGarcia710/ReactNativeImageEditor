import {NavigationContainer} from '@react-navigation/native';
import * as React from 'react';
import RootNavigator from './navigators/RootNavigator';

const Navigation = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
