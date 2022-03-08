import { background, body, face, Trait } from './traits'
import { NftTobe } from './types/generator'

const TARGET_NUM_OF_NFT = 100
const RARE_FACE_TRAIT_ID = 7
const MAX_NUM_OF_FACE_RARITY = 2

const ALSs: NftTobe[] = new Array(TARGET_NUM_OF_NFT)
let totalFaceRareTraits = 0

/**
 * 
 * @param limit 
 * @returns the random index below the limit number
 */
const randIndexBelow = (limit: number): number => Math.floor(Math.random() * limit)

/**
 * 
 * @param traitTarget 
 * @param id 
 * @param RARE_TRAIT_ID 
 * @param MAX_NUM_OF_RARITY 
 * @returns the trait id refined
 */
const refineRarity = (traitTarget: Trait[], id: number, RARE_TRAIT_ID: number, MAX_NUM_OF_RARITY: number): number => {
    if (ALSs.length > 0 && id === RARE_TRAIT_ID) {
        totalFaceRareTraits += 1
        
        if (totalFaceRareTraits > MAX_NUM_OF_RARITY) {
            totalFaceRareTraits -= 1
            // infinite recursive call would not happen since the possibility that same traits are picked continuously is pretty low.
            return refineRarity(traitTarget, traitTarget[randIndexBelow(traitTarget.length)].id, RARE_TRAIT_ID, MAX_NUM_OF_RARITY)
        }
        return id
    }

    return id
}

/**
 * 
 * @param ALSs 
 * @returns a ALS token generated
 */
const generateALS = (ALSs: NftTobe[]): NftTobe | null => {
    const nftTobe: NftTobe = []

    nftTobe.push(refineRarity(face, face[randIndexBelow(face.length)].id, RARE_FACE_TRAIT_ID, MAX_NUM_OF_FACE_RARITY))
    nftTobe.push(body[randIndexBelow(body.length)].id)
    nftTobe.push(background[randIndexBelow(background.length)].id)
    
    const isRedundant = ALSs.some((item: NftTobe) => JSON.stringify(item) === JSON.stringify(nftTobe))
    return isRedundant? null : nftTobe
}

/**
 * generates 500 ALS tokens
 */
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



