import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import DashboardScreen from '../screens/DashboardScreen';
import SideMenu from '../components/SideMenu';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ route }: any) => {
  return (
    <Drawer.Navigator
      drawerContent={() => <SideMenu />}
      screenOptions={{
        headerShown: false,
      }}>

      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        initialParams={{
          userId: route.params?.userId,
        }}
      />

    </Drawer.Navigator>
  );
};

export default DrawerNavigator;