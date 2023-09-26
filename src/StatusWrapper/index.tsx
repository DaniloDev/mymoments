import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  Modal,
  Image,
  Pressable,
  Dimensions,
  TouchableOpacity,
  Animated,
  Alert
} from 'react-native'

import styles from './styles'
import { format, formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'
// import {statusData} from '../../helpers/defaultData';
import Ionicons from 'react-native-vector-icons/Ionicons'
Ionicons.loadFont

const StatusWrapper = ({ statusData, visible, onClose = false }) => {
  // const [visible, setVisible] = useState(true);
  const width = Dimensions.get('screen').width
  const height = Dimensions.get('screen').height
  const [current, setCurrent] = useState({ data: statusData[0], index: 0 })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (current.index === statusData.length - 1) {
        // return onClose(true)
        return
      }
      setCurrent({
        ...current,
        index: current.index + 1,
        data: statusData[current.index + 1]
      })
      console.log('time out...')
      // clearInterval(timer);
    }, 3000)
    return () => clearTimeout(timer)
  }, [current])

  const ProgressView = (props) => {
    const progressAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
      Animated.timing(progressAnim, {
        toValue: (width - 40) / statusData.length,
        duration: 3000,
        useNativeDriver: false
      }).start()
    }, [progressAnim])

    return (
      <Animated.Text
        style={{ backgroundColor: '#fff', width: progressAnim }}
      ></Animated.Text>
    )
  }

  const filterFeelEmojis = (id: string) => {
    if (id.length > 0) {
      let feelEmojis = [
        { text: '😄 Awesome', id: 'awesome' },
        { text: '😊 Pretty good', id: 'pretty_good' },
        { text: '😐 Quite OK', id: 'quite_ok' },
        { text: '😔 Kind of bad', id: 'kind_of_bad' },
        { text: '😥 Horrible', id: 'horrible' }
      ]

      let sendFeelEmojis = feelEmojis.filter((element) => element.id === id)

      return sendFeelEmojis[0].text
    }
  }

  const filterReasonEmojis = (id: string) => {
    if (id.length > 0) {
      let reasonEmojis = [
        { text: '👪 Family', id: 'family' },
        { text: '🍲 Food', id: 'food' },
        { text: '👬 Friends', id: 'friends' },
        { text: '👨🏼‍⚕️ Health', id: 'health' },
        { text: '🪂 Hobbies', id: 'hobbies' },
        { text: '🚴 Sport', id: 'sport' },
        { text: '💼 Work', id: 'work' },
        { text: '❤️ Relationship', id: 'relationship' }
      ]

      let sendReasonEmojis = reasonEmojis.filter((element) => element.id === id)

      return sendReasonEmojis[0].text
    }
  }

  return (
    <Modal visible={visible}>
      <View style={styles.container}>
        <View style={styles.statusTabContainer}>
          {statusData.map((item, index) => (
            <View
              key={index}
              style={[
                styles.statusTab,
                {
                  marginHorizontal: 2,
                  backgroundColor: '#bbbbbb'
                }
              ]}
            >
              {/* <Text style={{width: '50%', backgroundColor: 'green'}}></Text> */}
              {current.index === index ? <ProgressView /> : null}
            </View>
          ))}
        </View>
        <Pressable
          onPress={() => {
            onClose(true)
          }}
        >
          {/* <Text style={{backgroundColor: 'red', color: '#fff'}}>
            Close Status
          </Text> */}
        </Pressable>

        <View style={styles.imageContainer}>
          <TouchableOpacity
            onPress={() => {
              return onClose(true)
            }}
          >
            <Ionicons
              style={{ top: 10, paddingLeft: 16 }}
              name="close-circle"
              size={24}
              color={'#ffffff'}
            />
          </TouchableOpacity>

          <View
            style={[
              current.data.image?.length > 0
                ? styles.imageStyleViewWithImage
                : styles.imageStyleViewWithOutImage
            ]}
          >
            {current.data.image?.length > 0 && (
              <Image
                source={{ uri: current.data.image }}
                resizeMode="contain"
                style={styles.imageStyle}
              />
            )}

            <Text
              style={[
                current.data.image?.length > 0
                  ? styles.dateWithImage
                  : styles.dateWithOutImage
              ]}
            >
              {format(current.data.date, 'EEEE, MMM dd, yyyy')}
            </Text>
            <Text
              style={[
                current.data.image?.length > 0
                  ? styles.textDecribeWithImage
                  : styles.textDecribeWithOutImage
              ]}
            >
              {current.data.describe.length > 48
                ? current.data.describe.substr(0, 48) +
                  '\n\b' +
                  current.data.describe.substr(48, current.data.describe.length)
                : current.data.describe}
            </Text>

            <Text
              style={[
                current.data.image?.length > 0
                  ? styles.placeWithImage
                  : styles.placeWithOutImage
              ]}
            >
              {current.data.placeName}
            </Text>
            <View style={styles.emojiViewContainer}>
              <View style={styles.emojisView}>
                <Text style={styles.emojisText}>
                  {filterFeelEmojis(current.data.feel)}
                </Text>
              </View>
              <View style={styles.emojisView}>
                <Text style={styles.emojisText}>
                  {filterReasonEmojis(current.data.reason)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          if (current.index === 0) {
            return onClose(true)
          }
          setCurrent({
            ...current,
            index: current.index - 1,
            data: statusData[current.index - 1]
          })
        }}
        style={[styles.controller]}
      >
        {/* <Text>left</Text> */}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          if (current.index === statusData.length - 1) {
            return onClose(true)
          }
          setCurrent({
            ...current,
            index: current.index + 1,
            data: statusData[current.index + 1]
          })
        }}
        style={[styles.controller, { right: 0 }]}
      >
        {/* <Text>right</Text> */}
      </TouchableOpacity>
    </Modal>
  )
}

export default StatusWrapper
