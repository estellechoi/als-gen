import { background, body, face, Trait } from './traits'
import { NftTobe } from './types/generator'

const RARE_FACE_TRAIT_ID = 77
const MAX_NUM_OF_FACE_RARITY = 2

const TARGET_NUM_OF_NFT = 500

const ALSs: NftTobe[] = new Array(500)

const randIndexBelow = (limit: number) => Math.floor(Math.random() * limit)

let totalFaceRareTraits = 0

// 연속해서 동일한 속성이 선택될 확률은 그렇게 크지 않으므로 무한 recursive 호출은 일어나지는 않을 것입니다.
const refineRarity = (traitTarget: Trait[], id: number, RARE_TRAIT_ID: number, MAX_NUM_OF_RARITY: number): number => {
    if (ALSs.length > 0 && id === RARE_TRAIT_ID) {
        totalFaceRareTraits += 1
        
        if (totalFaceRareTraits > MAX_NUM_OF_RARITY) {
            totalFaceRareTraits -= 1
            return refineRarity(traitTarget, traitTarget[randIndexBelow(traitTarget.length)].id, RARE_TRAIT_ID, MAX_NUM_OF_RARITY)
        }
        return id
    }

    return id
}

const generateALS = (ALSs: NftTobe[]): NftTobe | null => {
    const nftTobe: NftTobe = []

    nftTobe.push(refineRarity(face, face[randIndexBelow(face.length)].id, RARE_FACE_TRAIT_ID, MAX_NUM_OF_FACE_RARITY))
    nftTobe.push(body[randIndexBelow(body.length)].id)
    nftTobe.push(background[randIndexBelow(background.length)].id)
    
    const isRedundant = ALSs.some((item: NftTobe) => JSON.stringify(item) === JSON.stringify(nftTobe))
    return isRedundant? null : nftTobe
}

const generateALSs = () => {
    while (ALSs.length < TARGET_NUM_OF_NFT) {
        const ALS = generateALS(ALSs)
        if (ALS !== null) {
            ALSs.push(ALS)
        }
    }
}

generateALSs()

console.log(`TOTAL_NUM_OF_NFT = ${ALSs.length}`);
console.log(`TOTAL_NUM_OF_RARITY = ${totalFaceRareTraits}`);



