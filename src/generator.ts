import * as fs from 'fs'
import * as constants from './constants'
import { createImage } from './draw'
import { getGatewayUrlByToken } from './nftStorage'
import { background, earings, eyes, eyewears, face, hair, lips, nose, Trait } from './traits'
import { NftTobe, TraitTarget } from './types/common'

const TARGET_NUM_OF_NFT = 100
const MAX_NUM_OF_FACE_RARITY = 1
const MAX_NUM_OF_HAIR_RARITY = 2
const MAX_NUM_OF_EYES_RARITY = 3
const MAX_NUM_OF_NOSE_RARITY = 1
const MAX_NUM_OF_LIPS_RARITY = 3
const MAX_NUM_OF_EYEWEARS_RARITY = 2
const MAX_NUM_OF_EARINGS_RARITY = 4
const MAX_NUM_OF_BG_RARITY = 10

const ALSs: NftTobe[] = new Array(TARGET_NUM_OF_NFT)
let totalFaceRareTraits = 0
let totalHairRareTraits = 0
let totalEyesRareTraits = 0
let totalNoseRareTraits = 0
let totalLipsRareTraits = 0
let totalEyewearsRareTraits = 0
let totalEaringsRareTraits = 0
let totalBgRareTraits = 0


/**
 * 
 * @param limit 
 * @returns the random index below the limit number
 */
const randIndexBelow = (limit: number): number => Math.floor(Math.random() * limit)

/**
 * 
 * @param traitTarget 
 * @param trait 
 * @returns final NFT tobe
 */
const refineRarity = (traitTarget: TraitTarget, trait: Trait): Trait => {
    if (ALSs.length > 0 && trait.rare) {
        
        const refine = (traits: Trait[], totalRareTraits: number, MAX_NUM_OF_RARITY: number): Trait => {
            totalRareTraits += 1

            if (totalRareTraits > MAX_NUM_OF_RARITY) {
                totalRareTraits -= 1
                // infinite recursive call would not happen since the possibility that same traits are picked continuously is pretty low.
                return refineRarity(traitTarget, traits[randIndexBelow(traits.length)])
            }
            return trait
        }
        
        switch (traitTarget) {
            case TraitTarget.Face: 
                refine(face, totalFaceRareTraits, MAX_NUM_OF_FACE_RARITY)
                break
            case TraitTarget.Hair: 
                refine(hair, totalHairRareTraits, MAX_NUM_OF_HAIR_RARITY)
                break
            case TraitTarget.Eyes: 
                refine(eyes, totalEyesRareTraits, MAX_NUM_OF_EYES_RARITY)
                break
            case TraitTarget.Nose: 
                refine(nose, totalNoseRareTraits, MAX_NUM_OF_NOSE_RARITY)
                break
            case TraitTarget.Lips: 
                refine(lips, totalLipsRareTraits, MAX_NUM_OF_LIPS_RARITY)
                break
            case TraitTarget.Eyewears: 
                refine(eyewears, totalEyewearsRareTraits, MAX_NUM_OF_EYEWEARS_RARITY)
                break
            case TraitTarget.Earings: 
                refine(earings, totalEaringsRareTraits, MAX_NUM_OF_EARINGS_RARITY)
                break
            case TraitTarget.Background: 
                refine(background, totalBgRareTraits, MAX_NUM_OF_BG_RARITY)
                break
            default:
                return trait
        }
    }
    
    return trait
}

/**
 * 
 * @param ALSs 
 * @returns a ALS token generated
 */
const generateALS = (ALSs: NftTobe[]): NftTobe | null => {
    const nftTobe: NftTobe = []
    
    nftTobe.push(refineRarity(TraitTarget.Face, face[randIndexBelow(face.length)]).id)
    nftTobe.push(refineRarity(TraitTarget.Hair, hair[randIndexBelow(hair.length)]).id)
    nftTobe.push(refineRarity(TraitTarget.Eyes, eyes[randIndexBelow(eyes.length)]).id)
    nftTobe.push(refineRarity(TraitTarget.Nose, nose[randIndexBelow(nose.length)]).id)
    nftTobe.push(refineRarity(TraitTarget.Lips, lips[randIndexBelow(lips.length)]).id)
    nftTobe.push(refineRarity(TraitTarget.Eyewears, eyewears[randIndexBelow(eyewears.length)]).id)
    nftTobe.push(refineRarity(TraitTarget.Earings, earings[randIndexBelow(earings.length)]).id)
    nftTobe.push(refineRarity(TraitTarget.Background, background[randIndexBelow(background.length)]).id)
    
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




