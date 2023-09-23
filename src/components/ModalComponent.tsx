import React from 'react'
import { Modal, StyleSheet } from 'react-native'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ModalComponent = () => {
  return (
    <SafeAreaView style={styles.fill}>
      <Modal visible={false} animationType="slide">
        <SafeAreaView style={[styles.fill, styles.grey]}></SafeAreaView>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  fill: {
    flex: 1
  },
  grey: {
    backgroundColor: '#ddd'
  }
})

export default ModalComponent
