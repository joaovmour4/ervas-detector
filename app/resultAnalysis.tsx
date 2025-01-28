import { Alert, Dimensions, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import api from './api'
import { AnalysisType } from '@/types/types'
import { useLocalSearchParams } from 'expo-router/build/hooks'
import { Ionicons } from '@expo/vector-icons'
import WeedItemList from '@/components/WeedItemList'
import ListSeparatorComponent from '@/components/ListSeparatorComponent'
import { useNavigation } from 'expo-router'

const { width, height } = Dimensions.get('window')

export default function resultAnalysis() {
    const navigation = useNavigation()
    const { id } = useLocalSearchParams()
    const [analysis, setAnalysis] = React.useState<AnalysisType>()
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
            setTempName(undefined)
        }
        setIsEditing(prevValue => !prevValue)
    }

    const onPressRemove = async () => {
        Alert.alert(
            'Remover Análise',
            `Tem certeza que deseja remover a análise "${analysis?.name}"?`,
            [
                {
                    text: 'Cancelar'
                },
                {
                    text: "Sim",
                    onPress: ()=> {
                        api
                            .delete(`/analysis/${analysis?.id}`)
                            .then(()=>{
                                navigation.goBack()
                            })
                            .catch(err => {
                                console.log(err.message)
                            })
                    },
                },
            ],
        )
    }

    // Setando o botão de remover analise no header
    React.useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity onPressOut={()=> onPressRemove()}>
                <Ionicons 
                    name='trash-outline'
                    size={25}
                    backgroundColor="transparent"
                    color="black"
                    style={{ paddingInlineEnd: 10 }}
                />
            </TouchableOpacity>
          ),
        });
      }, [navigation, analysis]);

    React.useEffect(()=>{
        api
            .get(`/analysis/id/${id}`)
            .then(result => {
                setAnalysis(result.data)
            })
    }, []) 

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
                { analysis?.image.url_s3 &&
                    <Image 
                        style={styles.image} 
                        source={{ uri: analysis?.image.url_s3 }} 
                />}
                {!analysis?.image.url_s3 && <Ionicons name='help' size={width} color={'#666666'} style={styles.image}/>}
            </TouchableOpacity>
            <View style={styles.infoContainer}>
                {analysis?.result ?
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
                    :
                    <Text style={styles.noWeedsDetectedText}>
                        Nenhuma Erva Daninha detectada.
                    </Text>
                }
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
        paddingInline: 10,
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
    noWeedsDetectedText: {
        fontStyle: 'italic', 
        textAlign: 'center'
    },
})