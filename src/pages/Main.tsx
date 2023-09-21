import React, {useEffect, useState} from 'react'
import {Text, View} from 'react-native'
import {NavigationContainer, useIsFocused} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import Home from './Home'

const Stack = createStackNavigator()

const Main = () => {

  return (
      <NavigationContainer>
       <Stack.Navigator
          initialRouteName='My Moments'
          screenOptions={{
            headerTintColor: '#fff',
            headerBackground: () => (
              <View style={{flex: 1, backgroundColor: '#52c8d1'}} />
            )
          }}>
          <Stack.Screen
            name='My Moments'
            component={Home}
            options={{
              headerRight: props => <View><Text>Menu</Text></View>
            }}

          />
          </Stack.Navigator>
      </NavigationContainer>
  )
}

export default Main