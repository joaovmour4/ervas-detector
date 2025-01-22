import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import api from './api'
import { AnalysisType } from '@/types/types'

interface props {
    idAnalysis: number
}

export default function resultAnalysis(props: props) {
    const [analysis, setAnalysis] = React.useState<AnalysisType>()
    React.useEffect(()=>{
        api
            .get(`/analysis/id/${props.idAnalysis}`)
            .then(result => setAnalysis(result.data))
    }, []) 

    return (
        <View>
        <Text>resultAnalysis</Text>
        </View>
    )
}

const styles = StyleSheet.create({})