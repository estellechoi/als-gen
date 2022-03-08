import * as fs from 'fs'
import * as constants from './constants'
import { createImage } from './draw'
import { getGatewayUrlByToken } from './nftStorage'
import { background, body, face, Trait } from './traits'
import { NftTobe } from './types/common'

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

const createALSImages = () => {
    ALSs.forEach(async (ALS, index) => {
        console.log('Creating an image...')
        await createImage(ALS, index)
    })
}

/**
 * convert ipfs uris to https gateway urls in meta.txt file to fetch via web later
 * to see flags available, check out https://nodejs.org/api/fs.html#file-system-flags
 */
const convertMetafileToGatewayUrl = () => {
    ALSs.forEach(async (_, index) => {
        const gatewayUrl = await getGatewayUrlByToken(index + 1, `./${constants.META_FILE_NAME}.txt`)
        const fileName = `${constants.META_FILE_NAME}.href.txt`
        fs.writeFileSync(fileName, `${gatewayUrl}\r\n`, { flag: 'a+' })
        // a+ flag opens file for reading and appending. The file is created if it does not exist.
    })
}

generateALSs()

console.log(`TOTAL_NUM_OF_NFT = ${ALSs.length}`)
console.log(`TOTAL_NUM_OF_RARITY = ${totalFaceRareTraits}`)

createALSImages()
convertMetafileToGatewayUrl()




