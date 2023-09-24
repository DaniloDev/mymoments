import React, { useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity,
  Alert
} from 'react-native'
import data from '../data'
import { MotiView } from 'moti'
import { Input } from 'react-native-elements'
import CheckBoxFeel from '../components/CheckBoxFeel'
import CheckBoxReason from '../components/CheckBoxReason'
import Ionicons from 'react-native-vector-icons/Ionicons'
Ionicons.loadFont

interface data {
  item: {
    id: number
    text: string
    date: string
    month: string
    feelCategory: string
    feel: string
    feelEmoji: string
    reason: string
    reasonEmoji: string
    image: string
  }
  index: number
}

const Stories = () => {
  const [visible, setVisible] = useState(false)
  const [storyDescribe, setStoryDescribe] = useState('')
  const [disabledButtonSave, setDisabledButtonSave] = useState(true)
  const showModal = () => setVisible(true)
  const hideModal = () => setVisible(false)

  const [optionsFeel, setOptionsFeel] = useState([])
  const [optionsReason, setOptionsReason] = useState([])

  const opFeel1 = { text: '😄 Awesome', id: 'awesome' }
  const opFeel2 = { text: '😊 Pretty good', id: 'pretty_good' }
  const opFeel3 = { text: '😐 Quite OK', id: 'quite_ok' }
  const opFeel4 = { text: '😔 Kind of bad', id: 'kind_of_bad' }
  const opFeel5 = { text: '😥 Horrible', id: 'horrible' }

  const opReason1 = { text: '👪 Family', id: 'family' }
  const opReason2 = { text: '🍲 Food', id: 'food' }
  const opReason3 = { text: '👬 Friends', id: 'friends' }
  const opReason4 = { text: '👨🏼‍⚕️ Health', id: 'health' }
  const opReason5 = { text: '🪂 Hobbies', id: 'hobbies' }
  const opReason7 = { text: '🚴 Sport', id: 'sport' }
  const opReason8 = { text: '💼 Work', id: 'work' }
  const opReason6 = { text: '❤️ Relationship', id: 'relationship' }

  const optionsFeelMultiple = [opFeel1, opFeel2, opFeel3, opFeel4, opFeel5]
  const optionsReasonMultiple = [
    opReason1,
    opReason2,
    opReason3,
    opReason4,
    opReason5,
    opReason6,
    opReason7,
    opReason8
  ]

  const handleCanSave = () => {
    console.log(storyDescribe)
    console.log(optionsFeel)
    if (
      storyDescribe.trim().toString().length >= 6 &&
      optionsFeel.toString().length > 0
    ) {
      Alert.alert('Success', 'Nice')
    } else {
      Alert.alert(
        'Error',
        'Fill in the  "Your story" field which must have at least 6 characters and select "How did you feel"'
      )
    }
  }

  const renderItem = ({ item, index }: data) => {
    return (
      <MotiView
        style={styles.listContainer}
        from={{ opacity: 0, translateY: 50 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ delay: 1000 + index * 200 }}
      >
        <Text style={styles.text}>{item.text}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Ionicons
            style={{ top: 10, paddingLeft: 16 }}
            name="calendar-sharp"
            size={18}
            color={'#154'}
          />
          <Text style={styles.date}>{item.date}</Text>
          <View
            style={{
              flexDirection: 'row',
              left: 130,
              top: 7
            }}
          >
            <Text>{item.feelEmoji}</Text>
            <Text>{item.reasonEmoji}</Text>
          </View>
        </View>
      </MotiView>
    )
  }
  return (
    <>
      <View style={{ backgroundColor: '#ffffff' }}>
        <TouchableOpacity onPress={showModal}>
          <Text style={{ textAlign: 'right', right: 20 }}>
            <Ionicons name="add-circle" size={25} color={'#000000'} />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: '#ffffff' }}>
        <Text style={{ textAlign: 'center' }}>My Stories</Text>
      </View>
      <SafeAreaView style={styles.container}>
        {/*   INICIO MODAL        */}
        <Modal visible={visible} animationType="slide">
          <SafeAreaView style={[styles.container, styles.grey]}>
            <SafeAreaView
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                padding: 10
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  hideModal()
                  setStoryDescribe('')
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: '#000000'
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleCanSave()}
                // disabled={disabledButtonSave}
              >
                <Text
                  style={{
                    fontSize: 18
                    //color: disabledButtonSave ? '#7673737e' : '#000000'
                  }}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </SafeAreaView>

            <View
              style={{
                alignItems: 'left',
                backgroundColor: '#ffffff',
                flex: 1,
                padding: 5
              }}
            >
              <Text
                style={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: '#000000'
                }}
              >
                Your story
              </Text>

              <Input
                style={{
                  fontSize: 16,
                  color: '#000',
                  borderWidth: 1,
                  borderBottomWidth: 0.2,
                  marginTop: 20,
                  borderRadius: 6,
                  right: 0,
                  left: 0,
                  elevation: 0,
                  borderTopColor: '#a7a7a7',
                  borderBottomColor: '#a7a7a7',
                  borderRightColor: '#a7a7a7',
                  borderLeftColor: '#a7a7a7',
                  paddingLeft: 25,
                  paddingBottom: 20
                }}
                placeholder={
                  'Describe your day in one setence. Take the time to think about waht has made your day.'
                }
                value={storyDescribe}
                onChangeText={(str) => setStoryDescribe(str)}
                multiline={true}
                cursorColor={'#000000'}
              />
              <Text
                style={{
                  fontSize: 26,
                  fontWeight: 'bold',
                  color: '#000000'
                }}
              >
                How did you feel?
              </Text>
              <CheckBoxFeel
                options={optionsFeelMultiple}
                onChange={(op) => setOptionsFeel(op)}
                multiple={false}
              />

              <Text
                style={{
                  fontSize: 26,
                  fontWeight: 'bold',
                  color: '#000000'
                }}
              >
                What was the reason?
              </Text>
              <CheckBoxReason
                options={optionsReasonMultiple}
                onChange={(op) => setOptionsReason(op)}
                multiple={false}
              />
            </View>
            {console.log('FEELOPTION ', optionsFeel)}
            {console.log('REASONOPTION ', optionsReason)}
          </SafeAreaView>
          {/*   FIM MODAL   */}
        </Modal>
        <FlatList
          data={data}
          // @ts-ignore
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id}
          numColumns={1}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </>
  )
}

export default Stories

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10
  },
  listContainer: {
    width: Dimensions.get('window').width - 50,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 20,
    borderBottomWidth: 0.1,
    elevation: 1,
    height: Dimensions.get('window').height / 10,
    padding: 10
  },
  imageContainer: {
    margin: 15,
    borderRadius: 10,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: undefined,
    aspectRatio: 1
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 15
  },
  date: {
    fontWeight: 'bold',
    marginLeft: 15,
    marginTop: 10
  },
  button: {
    backgroundColor: '#62513E',
    padding: 10,
    margin: 15,
    borderRadius: 10
  },
  buttonText: {
    color: 'white',
    textAlign: 'center'
  },
  grey: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    bottom: 14,
    top: 14,
    elevation: 3
  }
})
