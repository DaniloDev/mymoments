import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native' 
import {Input} from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Ionicons'
Icon.loadFont();




const Configs = ({ navigation }: any) => {
    const [daylyMotivation, setDaylyMotivation] = useState('')
    return(
        <> 
       

            <View style={styles.container}>
                <Text style={styles.textmyDay}>My day</Text>
              {/*  <Input 
                style={{fontSize: 16, paddingRight: 40, color: '#000'}}
                placeholder='Digite uma frase que te motive'
                placeholderTextColor={'#a7a7a7'}
                value={daylyMotivation}
                multiline={true}
                onChangeText={str => setDaylyMotivation(str)}
                maxLength={200}
                cursorColor={'#000'}
    />*/}

    <View style={{flexDirection: 'row', top:25}}>
    <Icon name="sunny-outline" size={20} color="#9a9a9a"  style={{ paddingLeft: 15}}/>
     <Text style={styles.infophaseMototivation}> DAILY MOTIVATION</Text>
    </View>
    
    <Text style={{top:30, paddingLeft: 15 }}> TEXTO MOTIVACIONAL AQUI</Text>
    <TouchableOpacity
    onPress={() => navigation.navigate('configs')}
    
    >
        <Text>CLIQUE</Text>
    </TouchableOpacity>

</View>
            
        </>
       
    )


}





export default Configs

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#ffffff',
   },
   textmyDay: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    paddingLeft: 15
   },
   infophaseMototivation: {
    top:3,
    fontSize: 12,
    fontWeight: 'normal',
    color: '#9a9a9a',
   }
})