import React, { useState} from 'react'
import { View, Text, StyleSheet, Image } from 'react-native' 
import { TouchableOpacity } from 'react-native-gesture-handler';
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
                     <Text style={styles.textAwesome}>😃 Awesome</Text> 
                     <Text style={styles.textFamily}>👪 Family</Text> 
                   </View>

                   <View style={{ top: 60,  paddingLeft: 15}}>

                        <Text style={{ fontSize: 28, fontWeight: 'bold', color:'#000000'}}>Reflect on my life</Text>

                        <View style={{flexDirection: 'row', justifyContent: 'space-around', right:30, top: 20, paddingLeft: 22}}>

                        <TouchableOpacity
                        onPress={()=> {
                            console.log('MY GOOD TIMES')
                        }}
                        >

                        
                            <View style={{ width: 100,padding: 6, borderRadius: 6, backgroundColor: '#ffffff', elevation: 3, borderColor: '#000000', flexDirection: 'column'}}>
                            <Ionicons style={{ paddingBottom: 50}} name='happy-outline' size={32} color={'#000000'}/>
                                <Text>My good</Text>
                                <Text>times</Text>
                            </View>

                        </TouchableOpacity>
                            
                        <TouchableOpacity
                        onPress={()=> {
                            console.log('MY ROUGHER TIMES')
                        }}
                        >
                            <View style={{ width: 100,padding: 6, borderRadius: 6, backgroundColor: '#ffffff', elevation: 3, borderColor: '#000000', flexDirection: 'column'}}>
                                <Ionicons style={{ paddingBottom: 50}} name='sad-outline' size={32} color={'#000000'}/>
                                <Text>My rougher</Text>
                                <Text>times</Text>
                            </View>
                                
                        </TouchableOpacity>



                                
                        <TouchableOpacity
                        onPress={()=> {
                            console.log('MY HAPPY PLACES')
                        }}
                        >
                            <View style={{ width: 100,padding: 6, borderRadius: 6, backgroundColor: '#ffffff', elevation: 3, borderColor: '#000000', flexDirection: 'column'}}>
                                    <Ionicons style={{ paddingBottom: 50}} name='map-outline' size={32} color={'#000000'}/>
                                        <Text>My happy</Text>
                                        <Text>places</Text>
                            </View>
                                        
                        </TouchableOpacity>
                
                   </View>
                   
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
   textAwesome:{
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
    top:40,
    marginRight: 10   
},

textFamily: {
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
    top:40,   
},


})