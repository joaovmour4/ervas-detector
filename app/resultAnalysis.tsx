import { FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import api from './api'
import { AnalysisType } from '@/types/types'
import { useLocalSearchParams, useSearchParams } from 'expo-router/build/hooks'
import { Ionicons } from '@expo/vector-icons'
import WeedItemList from '@/components/WeedItemList'
import ListSeparatorComponent from '@/components/ListSeparatorComponent'

export default function resultAnalysis() {
    const { id } = useLocalSearchParams()
    const [analysis, setAnalysis] = React.useState<AnalysisType>()
    const [analysisName, setAnalysisName] = React.useState<string>()
    const [isEditing, setIsEditing] = React.useState(false)
    const [tempName, setTempName] = React.useState<string>()
    const [isModalVisible, setIsModalVisible] = React.useState(false)

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible)
    }

    const onPressEditName = () => {
        if(isEditing){
            api
                .put(`/analysis/name/${id}`, {
                    name: tempName
                })
                .then(()=> {
                    setAnalysisName(tempName)
                })
            setTempName(undefined)
        }
        setIsEditing(prevValue => !prevValue)
    }

    React.useEffect(()=>{
        api
            .get(`/analysis/id/${id}`)
            .then(result => {
                setAnalysis(result.data)
                setAnalysisName(analysis?.name)
            })
    }, [analysisName]) 

    return (
        <View style={styles.container}>
            <View style={styles.nameContainer}>
                {!isEditing ?
                    <Text style={styles.textNameContainer}>{analysis?.name}</Text>
                    :
                    <TextInput style={styles.textNameContainer} placeholder={analysis?.name} onChangeText={setTempName} />
                }
                <TouchableOpacity onPress={onPressEditName}>
                    <Ionicons 
                        size={25}
                        name={ !isEditing ? 'pencil-outline' : 'save-outline' }
                        color={'#6E8B3D'}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={toggleModal}>
                <Image 
                    style={styles.image} 
                    source={{ uri: analysis?.image.url_s3 }} 
                />
            </TouchableOpacity>
            <View style={styles.infoContainer}>
                <FlatList
                    data={analysis?.weeds}
                    renderItem={({item}) => <WeedItemList 
                            weed={item}
                        />}
                    keyExtractor={item => item.scientificName}
                    ItemSeparatorComponent={
                        () => <ListSeparatorComponent />
                    }
                />
            </View>
            <Modal visible={isModalVisible} transparent={true} animationType="none">
                <View style={styles.modalBackground}>
                    <TouchableOpacity style={styles.modalContent} onPress={toggleModal}>
                        <Image
                        source={{ uri: analysis?.image.url_s3 }}
                        style={styles.expandedImage}
                        resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DBE7C9',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    image: {
        aspectRatio: 1 / 1,
        width: '70%',
        borderRadius: 15,
        marginBlockEnd: 15
    },
    nameContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 40,
        paddingBlock: 10,
        paddingInline: 20,
        marginBlock: 25,
        justifyContent: 'center',
        alignItems: 'center',
        width: '85%',
    },
    textNameContainer: {
        fontSize: 15,
        height: 35,
        flex: 1,
        textAlignVertical: 'center'
    },
    infoContainer: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 15,
        paddingBlock: 15
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        height: '90%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
})