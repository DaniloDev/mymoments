import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { Input } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {
  GoogleSignin,
  statusCodes
} from '@react-native-google-signin/google-signin'
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  SignInMethod,
  User
} from 'firebase/auth'
import { authFirebase } from '../services/firebase'

import auth from '@react-native-firebase/auth'

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '299954349494-4jgjnj04qmn4h43n7pf36ak6187vhii5.apps.googleusercontent.com'
    })
  }, [])

  const loginWithEmailAndPassword = () => {
    signInWithEmailAndPassword(authFirebase, email, password)
      .then((result: User) => {
        console.log('RESULT ', result)

        if (result.emailVerified) {
          props.navigation.navigate('Home')
        } else {
          Alert.alert('Error', 'Email não verificado')
        }
      })
      .catch((error) => {
        Alert.alert(error.message)
      })
  }

  const signUpWithEmailAndPassword = () => {
    /*  createUserWithEmailAndPassword(auth, email, password)
      .then((result: any) => {
        console.log('RESULT ', result)
      })
      .catch((error) => {
        Alert.alert(error.message)
      })*/

    createUserWithEmailAndPassword(authFirebase, email, password)
      .then(() => {
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

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
      const { idToken, user } = await GoogleSignin.signIn()
      console.log('IDTOKEN ', idToken)
      const googleCredential = auth.GoogleAuthProvider.credential(idToken)

      console.log('USER LOGIN ', user)
      return auth().signInWithCredential(googleCredential)
    } catch (error: any) {
      console.log(error.message)
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  return (
    <>
      <View
        style={{
          flex: 1,
          alignContent: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff'
        }}
      >
        <Input
          value={email}
          onChangeText={(str) => setEmail(str)}
          placeholder="Email"
          style={{ fontSize: 18 }}
        />
        <Input
          value={password}
          onChangeText={(str) => setPassword(str)}
          placeholder="Senha"
          secureTextEntry={true}
          style={{ fontSize: 18 }}
        />
        <TouchableOpacity
          onPress={loginWithEmailAndPassword}
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
          <Text style={styles.signINText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => props.navigation.navigate('SignUP')}>
          <Text style={styles.createAccount}>
            Não possui conta? clique aqui
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default Login

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
