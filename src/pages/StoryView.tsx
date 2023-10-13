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
      if (id == 'awesome') {
        return '😄 Awesome'
      } else if (id == 'pretty_good') {
        return '😊 Pretty good'
      } else if (id == 'quite_ok') {
        return '😐 Quite OK'
      } else if (id == 'kind_of_bad') {
        return '😔'
      } else if (id == 'horrible') {
        return '😥 Horrible'
      }
    }
  }

  const filterReasonEmojis = (id: string) => {
    if (id.length > 0) {
      if (id == 'family') {
        return '👪 Family'
      } else if (id == 'food') {
        return '🍲 Food'
      } else if (id == 'friends') {
        return '👬 Friends'
      } else if (id == 'health') {
        return '👨🏼‍⚕️ Health'
      } else if (id == 'hobbies') {
        return '🪂 Hobbies'
      } else if (id == 'sport') {
        return '🚴 Sport'
      } else if (id == 'work') {
        return '💼 Work'
      } else if (id == 'relationship') {
        return '❤️ Relationship'
      }
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
    width: 122,
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
