import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AnalysisItemList from '@/components/AnalysisItemList'
import ListSeparatorComponent from '@/components/ListSeparatorComponent'
import { AnalysisItemListType, AnalysisType, WeedType } from '@/types/types'
import api from '../api'
import { Ionicons } from '@expo/vector-icons'
import Reload from '@/components/Reload'
import WeedItemList from '@/components/WeedItemList'

export default function species() {
  const [weeds, setWeeds] = React.useState<Array<WeedType>>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(()=>{
    api
      .get('/weeds')
      .then(response => {
        setWeeds(response.data)
        setIsLoading(false)
      })
  }, [])

  if(isLoading)
    return(
      <Reload />
    )

  return (
    <View style={styles.container}>
      <FlatList
        data={weeds}
        renderItem={({item}) => 
          <WeedItemList 
            weed={item}
          />}
        keyExtractor={item => item.scientificName}
        ItemSeparatorComponent={
            () => <ListSeparatorComponent />
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBE7C9',
    paddingInline: 20
  }
})