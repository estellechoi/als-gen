import dotenv from 'dotenv';
import * as fs from 'fs';
import path from 'path';
import * as constants from './constants';
import { createImage } from './draw';
import { getGatewayUrlByToken } from './nftStorage';
import { background, earings, eyes, eyewears, face, hair, lips, nose, Trait } from './traits';
import { NftTobe, TraitTarget } from './types/common';

dotenv.config()

const TARGET_NUM_OF_NFT = 100
const MAX_NUM_OF_FACE_RARITY = 10
const MAX_NUM_OF_HAIR_RARITY = 10
const MAX_NUM_OF_EYES_RARITY = 10
const MAX_NUM_OF_NOSE_RARITY = 10
const MAX_NUM_OF_LIPS_RARITY = 20
const MAX_NUM_OF_EYEWEARS_RARITY = 40
const MAX_NUM_OF_EARINGS_RARITY = 40
const MAX_NUM_OF_BG_RARITY = 100

const ALSs: NftTobe[] = []

let totalFaceRareTraits = 0
let totalHairRareTraits = 0
let totalEyesRareTraits = 0
let totalNoseRareTraits = 0
let totalLipsRareTraits = 0
let totalEyewearsRareTraits = 0
let totalEaringsRareTraits = 0
let totalBgRareTraits = 0

const FILE_PATH = constants.FILE_PATH

const __dirname = path.resolve()
const basePath = `${__dirname}/${FILE_PATH}`


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
                
        switch (traitTarget) {
            case TraitTarget.Face: 
                totalFaceRareTraits += 1
                if (totalFaceRareTraits > MAX_NUM_OF_FACE_RARITY) {
                    totalFaceRareTraits-= 1
                    return refineRarity(traitTarget, face[randIndexBelow(face.length)])
                } else return trait
            case TraitTarget.Hair: 
                totalHairRareTraits += 1
                if (totalHairRareTraits > MAX_NUM_OF_HAIR_RARITY) {
                    totalHairRareTraits-= 1
                    return refineRarity(traitTarget, hair[randIndexBelow(hair.length)])
                } else return trait
                // refine(hair, totalHairRareTraits, MAX_NUM_OF_HAIR_RARITY)
            case TraitTarget.Eyes: 
                totalEyesRareTraits += 1
                if (totalEyesRareTraits > MAX_NUM_OF_EYES_RARITY) {
                    totalEyesRareTraits-= 1
                    return refineRarity(traitTarget, eyes[randIndexBelow(eyes.length)])
                } else return trait
                // refine(eyes, totalEyesRareTraits, MAX_NUM_OF_EYES_RARITY)
            case TraitTarget.Nose: 
                totalNoseRareTraits += 1
                if (totalNoseRareTraits > MAX_NUM_OF_NOSE_RARITY) {
                    totalNoseRareTraits-= 1
                    return refineRarity(traitTarget, nose[randIndexBelow(nose.length)])
                } else return trait
                // refine(nose, totalNoseRareTraits, MAX_NUM_OF_NOSE_RARITY)
            case TraitTarget.Lips: 
                totalLipsRareTraits += 1
                if (totalLipsRareTraits > MAX_NUM_OF_LIPS_RARITY) {
                    totalLipsRareTraits-= 1
                    return refineRarity(traitTarget, lips[randIndexBelow(lips.length)])
                } else return trait
                // refine(lips, totalLipsRareTraits, MAX_NUM_OF_LIPS_RARITY)
            case TraitTarget.Eyewears: 
                totalEyewearsRareTraits += 1
                if (totalEyewearsRareTraits > MAX_NUM_OF_EYEWEARS_RARITY) {
                    totalEyewearsRareTraits-= 1
                    return refineRarity(traitTarget, eyewears[randIndexBelow(eyewears.length)])
                } else return trait
                // refine(eyewears, totalEyewearsRareTraits, MAX_NUM_OF_EYEWEARS_RARITY)
            case TraitTarget.Earings: 
                totalEaringsRareTraits += 1
                if (totalEaringsRareTraits > MAX_NUM_OF_EARINGS_RARITY) {
                    totalEaringsRareTraits-= 1
                    return refineRarity(traitTarget, earings[randIndexBelow(earings.length)])
                } else return trait
            case TraitTarget.Background: 
                totalBgRareTraits += 1
                if (totalBgRareTraits > MAX_NUM_OF_BG_RARITY) {
                    totalBgRareTraits-= 1
                    return refineRarity(traitTarget, background[randIndexBelow(background.length)])
                } else return trait
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
    
    // remove redundancy
    const isRedundant = ALSs.some((item: NftTobe) => JSON.stringify(item) === JSON.stringify(nftTobe))
    return isRedundant? null : nftTobe
}

/**
 * generates 500 ALS tokens
 */
const generateALSs = () => {
    while (ALSs.length < TARGET_NUM_OF_NFT) {
        const newALS = generateALS(ALSs)
        if (newALS !== null) {
            ALSs.push(newALS)
        }
    }
}

const createALSImages = async() => {
    console.log('Creating images...')

    // forEach's callback cannot be used with async await
    for (let i = 0; i < ALSs.length; i += 1) {
        console.log(`Creating an image of ALS-${i + 1}`)
        await createImage(ALSs[i], i)
    }
}

/**
 * convert ipfs uris to https gateway urls in meta.txt file to fetch via web later
 * to see flags available, check out https://nodejs.org/api/fs.html#file-system-flags
 */
const convertMetafileToGatewayUrl = async () => {
    console.log('convertMetafileToGatewayUrl')
    for (let i = 0; i < ALSs.length; i += 1) {
        const gatewayUrl = await getGatewayUrlByToken(i + 1, `${basePath}/${constants.META_FILE_NAME}.txt`)
        const fileName = `${constants.META_FILE_NAME}.href.txt`
        fs.writeFileSync(`${basePath}/${fileName}`, `${gatewayUrl}\r\n`, { flag: 'a+' })
        // a+ flag opens file for reading and appending. The file is created if it does not exist.
    }
}

const start = async () => {
    generateALSs()

    console.log(`TOTAL_NUM_OF_NFT = ${ALSs.length}`)
    console.log(`TOTAL_NUM_OF_FACE_RARITY = ${totalFaceRareTraits}`)
    console.log(`TOTAL_NUM_OF_HAIR_RARITY = ${totalHairRareTraits}`)
    console.log(`TOTAL_NUM_OF_EYES_RARITY = ${totalEyesRareTraits}`)
    console.log(`TOTAL_NUM_OF_NOSE_RARITY = ${totalNoseRareTraits}`)
    console.log(`TOTAL_NUM_OF_LIPS_RARITY = ${totalLipsRareTraits}`)
    console.log(`TOTAL_NUM_OF_EYEWEARS_RARITY = ${totalEyewearsRareTraits}`)
    console.log(`TOTAL_NUM_OF_EARINGS_RARITY = ${totalEaringsRareTraits}`)
    console.log(`TOTAL_NUM_OF_BG_RARITY = ${totalBgRareTraits}`)
    
    await createALSImages()
    await convertMetafileToGatewayUrl()
}

start()





