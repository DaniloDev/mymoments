import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native'
import React from 'react'
import data from '../data'
import { MotiView } from 'moti'
import { TouchableOpacity } from 'react-native-gesture-handler'
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

const FlatlistRevealAnimationScreen = () => {
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
        <TouchableOpacity>
          <Text style={{ textAlign: 'right', right: 20 }}>
            <Ionicons name="add-circle" size={25} color={'#000000'} />
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: '#ffffff' }}>
        <Text style={{ textAlign: 'center' }}>My Stories</Text>
      </View>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item: any) => item.id}
          numColumns={1}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </>
  )
}

export default FlatlistRevealAnimationScreen

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
  }
})
