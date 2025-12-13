export type TryOnStatus = 'pending' | 'processing' | 'completed' | 'failed'

type ClothingItem = {
    imageUrl: string,
    category: 'top' | 'bottom' | 'dress' | 'shoes' | 'outerwear'
}
export interface TryOnSession {
    id: string,
    originUserImageUrl: string,
    selectedItems: ClothingItem[],
    resultImageUrl?: string | null,
    status: TryOnStatus
}