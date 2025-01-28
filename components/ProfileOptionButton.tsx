import { StyleSheet, Text, TouchableOpacity, Image, View, Modal, FlatList, Dimensions } from 'react-native'
import React from 'react'
import { ProfileButtonPropsType, WeedType } from '@/types/types'
import { Ionicons } from '@expo/vector-icons'

export default function ProfileOptionButton( props: ProfileButtonPropsType ) {

    return (
        <TouchableOpacity style={styles.container} onPress={props.callbackFn}>
            <Ionicons name={props.iconName} size={styles.thumbnail.height} color={'black'} style={styles.thumbnail}/>
            <Text style={styles.text}>{props.text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingBlock: 10,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    thumbnail: {
        height: 35,
        width: 35,
        borderRadius: 4,
        marginInlineEnd: 10,
        flex: 0
    },
    text: {
        fontSize: 20,
        textAlign: 'left'
    },
})