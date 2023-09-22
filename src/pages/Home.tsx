import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native' 
import {Input} from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
Ionicons.loadFont

const Home = ({ navigation }: any) => {
    const [daylyMotivation, setDaylyMotivation] = useState('')
    return(
        <> 
         <View style={{ backgroundColor: '#ffffff'}}>
            <TouchableOpacity
            
            >
             <Text style={{ textAlign: 'right', right: 20}}><MaterialIcons name='settings' size={25} color={'#000000'}/></Text>
         </TouchableOpacity>
        </View>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row'}}>
                    <Text style={styles.textmyDay}> My day</Text>
                  
                   
                </View>
               
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
        <Ionicons name="sunny-outline" size={20} color="#9a9a9a"  style={{ paddingLeft: 28}}/>
        <Text style={styles.infophaseMototivation}> DAILY MOTIVATION</Text>
    </View>
    
    <View style={{flexDirection: 'column'}}>
            <Text style={{top:30, paddingLeft: 32 }}>TEXTO MOTIVACIONAL AQUI</Text>
    </View>
    <View
    style={{ top: 40, paddingLeft: 20}}
    
    >
         <View style={{flexDirection: 'row', top:25}}>
        <Ionicons name="journal-outline" size={20} color="#9a9a9a"style={{ paddingLeft: 12}}/>
        <Text style={{ paddingLeft: 2.,  fontSize: 12}}>WEDNESDAY, MAY 13, 2020</Text>
       
        </View>
        <View style={{flexDirection: 'column'}}>
                   <Text style={{top:30,  paddingLeft: 15 }}>I reaaly enejoyed sppending time with my family.</Text>
                   <View style={{ flexDirection: 'row'}}>
                     <Text style={styles.textshadow}>😃 Awesome</Text> 
                     <Text style={styles.textshadow}>😃 Awesome</Text> 
                   </View>
         </View>
    </View>
     
</View>
            
        </>
       
    )


}





export default Home

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#ffffff',
   },
   textmyDay: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    paddingLeft: 25
   },
   infophaseMototivation: {
    top:3,
    fontSize: 12,
    fontWeight: 'normal',
    color: '#9a9a9a',
    
   },
   textshadow:{
    fontSize:16,
    color:'#000000',
    fontFamily:'Times New Roman',
    paddingLeft:15,
    paddingRight:30,

    textShadowOffset:{width: 5, height: 5},
    textShadowRadius:10,
    borderWidth: 0.1,
    width: 140,
    height: 26,
    backgroundColor: "#c4c1ac85",
    right: 20,
    left:20,
    top:40,   },
})