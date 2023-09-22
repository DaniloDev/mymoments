import React from 'react';
import {View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
Ionicons.loadFont

interface Props {
  route: string;
  isFocused: boolean;
}

const BottomTabIcon = ({route, isFocused}: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const renderIcon = (route: string, isFocused: boolean) => {
    let height: number = 34;
    let width: number = 34;

    switch (route) {
      case 'Home':
        return (
        isFocused ? <Ionicons name='sunny' size={34} color={'#0067FF'}/> 
                :
        <Ionicons name='sunny-outline' size={34} color={'#ffffff'}/> 
        
        );
      case 'Configs':
        return (
            isFocused ? <Ionicons name='settings' size={34} color={'#0067FF'}/> 
                    :
            <Ionicons name='settings-outline' size={34} color={'#ffffff'}/> 
            
            );
      default:
        break;
    }
  };

  return <View>{renderIcon(route, isFocused)}</View>;
};

export default BottomTabIcon;
