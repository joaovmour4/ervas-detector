import { Ionicons } from "@expo/vector-icons"

export type UserType = {
    id: number
    profileImage: string
    name: string
    email: string
    city: string
}

export type AnalysisItemListType = {
    id: number
    name: string
    thumbnail: string
    analysis_date: Date
}

export type AnalysisType = {
    id: number
    name: string
    image: {
        url_s3: string
        type: string
    }
    weeds: Array<WeedType>
    result: boolean
    analysis_date: string
}

export type WeedType = {
    thumbnail: string
    scientificName: string
    popularName: string
    description: string
    quimicComponent: string
    image_urls: Array<string>
}

export type ProfileButtonPropsType = {
    text: string
    iconName: keyof typeof Ionicons.glyphMap
    callbackFn: () => void
}