import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function Reload() {
    return(
        <View style={styles.container}>
            <Ionicons
            name='reload'
            size={80}
            color={'black'}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#DBE7C9'
    }
})