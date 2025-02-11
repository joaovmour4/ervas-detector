import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AnalysisItemListType } from '@/types/types'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function AnalysisItemList(analysis: AnalysisItemListType) {
  const router = useRouter()
  const onPress = () => {
    router.navigate({
      pathname: '/resultAnalysis',
      params: { id: analysis.id }
    })
  }
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {analysis.thumbnail && <Image style={styles.thumbnail} source={{ uri: analysis.thumbnail }} />}
      {!analysis.thumbnail && <Ionicons name='help-circle-outline' size={styles.thumbnail.height} color={'#4A4A4A'} style={styles.thumbnail}/>}
      <Text style={styles.title}>{analysis.name}</Text>
      <Text style={styles.date}>{analysis.analysis_date.getDate()}/{analysis.analysis_date.getMonth()+1}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
      paddingBlock: 10,
      paddingLeft: 15,
      flexDirection: 'row',
      alignItems: 'center',
    },
    thumbnail: {
      width: 75,
      height: 75,
      borderRadius: 40
    },
    title: {
      fontSize: 18,
      fontWeight: 'normal',
      paddingInlineStart: 20,
      color: '#4A4A4A',
      flex: 1
    },
    date: {
      paddingInlineEnd: 15
    }
})