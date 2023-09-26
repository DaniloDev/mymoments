import React, { useState } from 'react';
import {Image, TouchableOpacity, View, Text, Pressable, ScrollView} from 'react-native';

import ProfileImage from '../../assets/Danilo.png';
//import * as SCREENS from '../../constants/screens';
import StatusWrapper from '../StatusWrapper';

const Profile = ({ profile }) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
    <Pressable onPress={() => {
      console.log('profile pressed')
      setVisible(true);
      console.log('visible: ', visible)
    }}>
      <ScrollView horizontal={true}>
      <View>
        <View style={{borderWidth: 3, borderColor: 'transparent', borderRadius: 40, padding: 5, marginRight: 10}}>
          <Image style={{width: 65, height: 65, borderRadius: 50}} source={ProfileImage} />
        </View>
        <Text>   Danilo</Text>
      </View>
      <View>
        <View style={{borderWidth: 3, borderColor: 'transparent', borderRadius: 40, padding: 5, marginRight: 10}}>
          <Image style={{width: 65, height: 65, borderRadius: 50}} source={ProfileImage} />
        </View>
        <Text>   Danilo</Text>
      </View>
      </ScrollView>
    </Pressable>
    {visible && <StatusWrapper statusData={profile.statusData} visible={visible} onClose={data => setVisible(false)} />}
    </>
  );
};

export default Profile;
