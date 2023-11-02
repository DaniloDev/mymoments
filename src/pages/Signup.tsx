import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Input } from 'react-native-elements'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth'
import { authFirebase } from '../services/firebase'

const SignUp = (props: any) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signUpWithEmailAndPassword = () => {
    createUserWithEmailAndPassword(authFirebase, email, password)
      .then(() => {
        const user: any = authFirebase.currentUser

        const currentUser = {
          name: name,
          email: email,
          uid: user?.uid
        }

        sendEmailVerification(user)
          .then(() => {
            createNewUser(currentUser)
            Alert.alert(
              'Verificação de Email',
              'Foi enviado um email link no email cadastrado para verificação'
            )

            props.navigation.navigate('Login')
          })
          .catch((error: any) => {
            console.log(error.message)
          })

        console.log('CURRENT USER ', currentUser)

        console.log('User account created & signed in!')
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!')
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!')
        }
        console.error(error)
      })
  }

  const createNewUser = async (currentUser: any) => {
    console.log('currentUser ', currentUser)
    try {
      const createNewUser = await fetch(
        'https://europe-west2-mymoments-d9088.cloudfunctions.net/createNewUser',
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({ data: currentUser })
        }
      ).then((res) => {
        res.json().then((r) => {
          console.log('R SUPPORT ', r)
          if (r.result.success == false) {
            console.log('DEU PAU MOPAI')
          } else if (r.result.success == true) {
            setTimeout(() => {
              console.log('AI MOPAI')
            }, 100)

            //navigation.goBack(null)
          } else {
            console.log('DEU PAU MOPAI ELSE')
          }
        })
      })
    } catch (error) {
      console.log('DEU PAU MOPAI CATCH')
    }
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Input
          placeholder="Nome"
          value={name}
          onChangeText={(str) => setName(str)}
          style={{ fontSize: 18 }}
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={(str) => setEmail(str)}
          style={{ fontSize: 18 }}
        />

        <Input
          placeholder="Senha"
          value={password}
          secureTextEntry={true}
          onChangeText={(str) => setPassword(str)}
          style={{ fontSize: 18 }}
        />
        <TouchableOpacity
          onPress={signUpWithEmailAndPassword}
          style={{
            backgroundColor: '#0d8f1a',
            width: 200,
            height: 50,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6
          }}
        >
          <Text style={styles.signINText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}
export default SignUp

const styles = StyleSheet.create({
  signINText: {
    fontSize: 22,
    textAlign: 'center',
    color: '#ffffff'
  },

  createAccount: {
    top: 30,
    fontSize: 16,
    textAlign: 'center',
    color: '#000000'
  }
})
