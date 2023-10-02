import React from 'react'
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native'
import { format, formatDistance } from 'date-fns'
const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const StoryView = (props: any) => {
  const {
    route: {
      params: { story }
    }
  } = props

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
    <View style={styles.container}>
      <Image
        source={{ uri: story[0].image }}
        resizeMode="contain"
        style={styles.imageStyle}
      />
      <Text style={styles.dateWithImage}>
        {format(story[0].date, 'EEEE, MMM dd, yyyy')}
      </Text>
      <Text style={styles.textDecribeWithImage}>{story[0].describe}</Text>
      <Text style={styles.placeWithImage}>{story[0].placeName}</Text>

      <View style={styles.emojiViewContainer}>
        <View style={styles.emojisView}>
          <Text style={styles.emojisText}>
            {filterFeelEmojis(story[0].feel)}
          </Text>
        </View>
        <View style={styles.emojisView}>
          <Text style={styles.emojisText}>
            {filterReasonEmojis(story[0].reason)}
          </Text>
        </View>
      </View>
    </View>
  )
}

export default StoryView

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    alignContent: 'center',
    justifyContent: 'center'
  },
  imageStyle: {
    width: '100%',
    height: height / 1.5,
    maxHeight: height / 1.5
  },
  dateWithImage: {
    color: '#bbbbbb',
    left: 40,
    bottom: 2,
    paddingBottom: 4
  },
  textDecribeWithImage: {
    color: '#ffffff',
    left: 40,
    paddingBottom: 8
  },
  placeWithImage: {
    color: '#eb705f',
    left: 40,
    paddingBottom: 4
  },
  emojiViewContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  emojisView: {
    top: 8,
    left: 38,
    width: 120,
    marginBottom: 8,
    height: 36,
    borderRadius: 6,
    borderWidth: 2,
    elevation: 3,
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    color: '#555',
    marginRight: 8
  },
  emojisText: {
    color: '#555',
    fontSize: 15,
    fontWeight: '600',
    padding: 5,
    textAlign: 'center'
  }
})
