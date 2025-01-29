import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'

interface props {
    label: string
    placeholder?: string
}

export default function ProfileEditField(props: props) {
  return (
    <View style={styles.container}>
      <Text style={styles.otherText}>{props.label}:</Text><TextInput style={styles.textInput} placeholder={props.placeholder} />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    otherText: {
        fontSize: 16,
        textAlign: 'center'
    },
    textInput: {
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'gray',
        width: '30%'
    }
})