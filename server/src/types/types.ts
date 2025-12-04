export type TryOnStatus = 'pending' | 'processing' | 'completed' | 'failed'

type ClothingItem = {
    imageUrl: string,
    category: 'top' | 'bottom' | 'dress' | 'shoes' | 'outerwear'
}
export interface TryOnSession {
    id: string,
    userImageUrl: string,
    clothingImageUrl: ClothingItem[],
    resultImageUrl?: string | null,
    status: TryOnStatus
}