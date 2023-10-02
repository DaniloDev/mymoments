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

const CheckBoxFeel = ({
  options = [],
  onChange,
  multiple = false,
  option = null
}) => {
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

  useEffect(() => {
    getConfigs()
  }, [])

  const getConfigs = async () => {
    let selecionados = option

    console.log('SELECIONADOS ', selecionados)

    if (selecionados !== null && selecionados !== undefined) {
      for (let i = 0; i < selecionados.length; i++) {
        arrSelecteds.push(selecionados[i])
      }
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
                    ? 'transparent'
                    : 'transparent',
                backgroundColor:
                  selected.findIndex((i) => i === op.id) !== -1
                    ? '#bbbbbb'
                    : '#f0f0f0f6'
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

export default CheckBoxFeel

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
    top: 10,

    width: Dimensions.get('screen').width - 500,
    marginBottom: 8,
    height: 40,
    borderRadius: 6,
    borderWidth: 2,
    elevation: 3,
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    color: '#555',
    marginRight: 8,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  optext: {
    color: '#555',
    fontSize: 15,
    fontWeight: '600',
    padding: 5,
    textAlign: 'center'
  }
})
