import { StyleSheet, Text, TouchableOpacity, Image, View, Modal, FlatList, Dimensions } from 'react-native'
import React from 'react'
import { WeedType } from '@/types/types'
import { Ionicons } from '@expo/vector-icons'

interface Props {
    weed: WeedType
}

const { width, height } = Dimensions.get('window');

export default function WeedItemList( props: Props ) {
    const [isModalVisible, setModalVisible] = React.useState(false)
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)

    const toggleModal = (index: number) => {
        setSelectedImageIndex(index);
        setModalVisible(!isModalVisible);
    };

    return (
        <TouchableOpacity style={styles.container} onPress={()=> toggleModal(0)}>
            {props.weed.thumbnail && <Image style={styles.thumbnail} source={{ uri: props.weed.thumbnail }} />}
            {!props.weed.thumbnail && <Ionicons name='help-circle-outline' size={styles.thumbnail.height} color={'black'} style={styles.thumbnail}/>}
            <View style={styles.weedTextContainer}>
                <Text style={styles.text}>Nome Científico: {props.weed.scientificName}</Text>
                <Text style={styles.text}>Nome Popular: {props.weed.popularName}</Text>
                <Text style={styles.text}>Descrição: {props.weed.description}</Text>
                <Text style={styles.text}>Pesticida recomendado: {props.weed.quimicComponent}</Text>
            </View>

            <Modal visible={isModalVisible} transparent={true} animationType="fade">
                <View style={styles.modalBackground}>
                    <FlatList
                        data={props.weed.image_urls}
                        keyExtractor={(_, index) => index.toString()}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        initialScrollIndex={selectedImageIndex}
                        onMomentumScrollEnd={(event) => {
                        const newIndex = Math.floor(
                            event.nativeEvent.contentOffset.x / width
                        );
                        setSelectedImageIndex(newIndex);
                        }}
                        renderItem={({ item }) => (
                        <Image
                            source={{ uri: item }}
                            style={styles.expandedImage}
                            resizeMode="contain"
                        />
                        )}
                    />
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Ionicons
                            name='close'
                            size={styles.closeIcon.width}
                            color='white'
                        />
                    </TouchableOpacity>
                </View>
            </Modal>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingInline: 50,
        paddingBlock: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    thumbnail: {
        height: 75,
        width: 75,
        borderRadius: 4,
        marginInlineEnd: 10
    },
    image: {
        width: 100,
        height: 100,
        margin: 10,
        borderRadius: 10,
    },
    weedTextContainer: {
    },
    text: {
        fontSize: 15
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    expandedImage: {
        width: width,
        height: height * 0.8,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
      closeIcon: {
        width: 30,
        height: 30,
    },
})