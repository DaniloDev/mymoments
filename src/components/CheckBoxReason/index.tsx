import React, { useEffect, useState } from 'react'
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import { calculateNewMassToMatchDuration } from 'react-native-reanimated/lib/typescript/reanimated2/animation/springUtils'
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons'

const CheckBoxReason = ({ options = [], onChange, multiple = false }) => {
  const [selected, setSelected] = useState([])
  let arrSelecteds = [...selected]
  const toggle = (id: any) => {
    let index = selected.findIndex((i) => i === id)

    if (index !== -1) {
      arrSelecteds.splice(index, 1)
    } else {
      multiple ? arrSelecteds.push(id) : (arrSelecteds = [id])
    }
    setSelected(arrSelecteds)
  }

  useEffect(() => onChange(selected), [selected])

  return (
    <View style={styles.container}>
      {options.map((op, index) => (
        <View key={op?.id} style={styles.optionContainer}>
          <TouchableOpacity
            style={[
              styles.touchable,
              {
                borderWidth:
                  // selected.findIndex(i => i === op.id) !== -1 || op.id === i18next.language
                  selected.findIndex((i) => i === op.id) !== -1 ? 1 : 1,

                borderColor:
                  selected.findIndex((i) => i === op.id) !== -1
                    ? '#000'
                    : 'transparent'
              }
            ]}
            onPress={() => toggle(op?.id)}
          >
            {selected.findIndex((i) => i === op.id) !== -1 ? (
              <Text style={styles.optext}>{op?.text}</Text>
            ) : (
              <Text style={styles.optext}>{op?.text}</Text>
            )}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )
}

export default CheckBoxReason

const styles = StyleSheet.create({
  container: {
    marginLeft: 7,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  optionContainer: {
    alignItems: 'center',
    color: '#0000'
  },
  touchable: {
    width: 110,
    marginBottom: 8,
    height: 30,
    borderRadius: 4,
    borderWidth: 2,
    elevation: 3,
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    color: '#555',
    marginRight: 8
  },
  optext: {
    color: '#555',
    fontSize: 14,
    fontWeight: '600',
    padding: 5
  }
})
