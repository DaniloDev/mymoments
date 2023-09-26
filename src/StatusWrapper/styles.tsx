import { StyleSheet, Dimensions } from 'react-native'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    paddingHorizontal: 10
  },
  statusTabContainer: {
    marginTop: 10,
    flexDirection: 'row',
    width: '100%'
  },
  statusTab: {
    height: 3,
    // backgroundColor: '#fff',
    backgroundColor: '#bbbbbb',
    flex: 1
  },
  controller: {
    position: 'absolute',
    width: width / 2,
    height: height * 0.9,
    bottom: 0
  },
  imageContainer: { backgroundColor: '#222' },
  imageStyle: {
    width: '100%',
    height: height / 1.5,
    maxHeight: height / 1.5
  },
  imageStyleViewWithImage: {
    top: 10,
    width: '100%',
    height: '100%',
    maxHeight: '100%'
  },

  imageStyleViewWithOutImage: {
    top: 10,
    width: '100%',
    height: '100%',
    maxHeight: '100%',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'stretch',
    paddingLeft: 50
  },
  textDecribeWithImage: {
    color: '#ffffff',
    left: 25
  },

  textDecribeWithOutImage: {},

  date: {
    color: '#bbbbbb',
    left: 25,
    bottom: 2
  },
  emojiViewContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  emojisView: {
    top: 8,
    left: 20,
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

export default styles
