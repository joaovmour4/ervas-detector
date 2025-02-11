import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { WeedType } from '@/types/types'
import api from '../api'
import WeedItemList from '@/components/WeedItemList'

export default function species() {
  const [weeds, setWeeds] = React.useState<Array<WeedType>>([])

  React.useEffect(()=>{
    api
      .get('/weeds')
      .then(response => {
        setWeeds(response.data)
      })
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={weeds}
        renderItem={({item}) => 
          <WeedItemList 
            weed={item}
          />}
        keyExtractor={item => item.scientificName}
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