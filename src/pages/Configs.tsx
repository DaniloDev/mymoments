import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, StatusBar } from 'react-native'
import { Input } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
Icon.loadFont()

const Configs = (props) => {
  const [daylyMotivation, setDaylyMotivation] = useState('')
  return (
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

        <View style={{ flexDirection: 'row', top: 25 }}></View>

        <TouchableOpacity>
          <Text>{props.route.params.users[0].name}</Text>
          <Text>Email: {props.route.params.users[0].email}</Text>
          <Text>CPF: {props.route.params.users[0].cpf}</Text>
        </TouchableOpacity>
        {console.log('Na tela de configs ', props.route.params.users[0].name)}
      </View>
    </>
  )
}

export default Configs

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  textmyDay: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000000',
    paddingLeft: 15
  },
  infophaseMototivation: {
    top: 3,
    fontSize: 12,
    fontWeight: 'normal',
    color: '#9a9a9a'
  }
})
