import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AnalysisItemListType } from '@/types/types'
import { Ionicons } from '@expo/vector-icons'

export default function AnalysisItemList(analysis: AnalysisItemListType) {
  return (
    <TouchableOpacity style={styles.container}>
      {analysis.thumbnail && <Image style={styles.thumbnail} source={{ uri: analysis.thumbnail }} />}
      {!analysis.thumbnail && <Ionicons name='help-circle-outline' size={styles.thumbnail.height} color={'black'} style={styles.thumbnail}/>}
      <Text style={styles.title}>Análise {analysis.id}</Text>
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
      borderBottomColor: 'rgba(70, 70, 70, 0.2)',
      borderBottomWidth: 0.3
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
      color: '#322E2C',
      flex: 1
    },
    date: {
      paddingInlineEnd: 15
    }
})