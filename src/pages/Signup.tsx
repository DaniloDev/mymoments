import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { Input } from 'react-native-elements'
import {
  createUserWithEmailAndPassword,
  sendEmailVerification
} from 'firebase/auth'
import { auth } from '../services/firebase'

const SignUp = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signUpWithEmailAndPassword = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        const currentUser = auth.currentUser

        sendEmailVerification(currentUser)
          .then(() => {
            Alert.alert(
              'Verificação de Email',
              'Foi enviado um email link no email cadastrado para verificação'
            )
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

  const createNewUser = async (currentUser) => {
    console.log('currentUser ', currentUser)
    try {
      const createNewUser = await fetch(
        'https://europe-west2-mymoments.cloudfunctions.net/createNewUser',
        {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({ data: currentUser })
        }
      ).then((res) => {
        res.json().then((r) => {
          if (r.result.error == -1) {
            Alert.alert('Deu erro')
          } else if (r.result.isActiveSubscription) {
            setPurchased(true)
          } else {
            if (messageExperired) {
              Alert.alert(
                translate('useValidatePurchase.validate.alerts.expired.title'),
                translate('useValidatePurchase.validate.alerts.expired.message')
              )
            }
          }
        })
      })
    } catch (error) {}
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
