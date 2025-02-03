import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

interface props {
    label: string
    useState: [
      string | undefined, 
      React.Dispatch<React.SetStateAction<string>>
    ]
}

export default function ProfileEditField(props: props) {
  const [value, setValue] = props.useState

  return (
    <View style={styles.container}>
      <Text style={styles.otherText}>{props.label}:</Text><TextInput style={styles.textInput} value={value} onChangeText={setValue} placeholder={props.label} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 15,
    },
    otherText: {
        fontSize: 16,
        textAlign: 'center'
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'gray',
        flex: 1
    }
})