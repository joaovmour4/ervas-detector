import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function ListSeparatorComponent() {
  return (
    <View style={styles.separator}>
    </View>
  )
}

const styles = StyleSheet.create({
    separator: {
        borderBottomColor: 'rgba(70, 70, 70, 0.2)', 
        borderBottomWidth: 0.3,
        width: '60%',
        alignSelf: 'center'
    }
})