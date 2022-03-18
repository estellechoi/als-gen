import * as fs from 'fs';
import { File, NFTStorage, toGatewayURL } from 'nft.storage';
import path from 'path';
import * as constants from './constants';
import { background, earings, eyes, eyewears, face, hair, lips, nose } from './traits';
import { NftTobe, TraitTarget } from './types/common';
import * as utils from './utils';


interface MetaData {
    description: string
    name: string
    image: File | Blob
}

interface OpenseaMetaData extends MetaData{
    type: string
    attributes: OpenseaAttributes[]
}

interface OpenseaAttributes {
    trait_type: string
    value: string
}

const FILE_PATH = constants.FILE_PATH
const FILE_FORMAT = constants.FILE_FORMAT

const __dirname = path.resolve()
const basePath = `${__dirname}/${FILE_PATH}`

const getOpenseaAttributes = (traitId: number, k: number): OpenseaAttributes => {
    let trait_type: string
    let value: string

    switch(k) {
        case 0:
            trait_type = TraitTarget.Face
            value = face[traitId - 1].name
            break
        case 1:
            trait_type = TraitTarget.Hair
            value = hair[traitId - 1].name
            break
        case 2:
            trait_type = TraitTarget.Eyes
            value = eyes[traitId - 1].name
            break
        case 3:
            trait_type = TraitTarget.Nose
            value = nose[traitId - 1].name
            break
        case 4:
            trait_type = TraitTarget.Lips
            value = lips[traitId - 1].name
            break
        case 5:
            trait_type = TraitTarget.Eyewears
            value = eyewears[traitId - 1].name
            break
        case 6:
            trait_type = TraitTarget.Earings
            value = earings[traitId - 1].name
            break                
        case 7:
            trait_type = TraitTarget.Background
            value = background[traitId - 1].name
            break
        default:
            trait_type = ''
            value = ''
    }

    return { trait_type, value }
}

export const uploadMetaData = async (ALS: NftTobe, ALSId: number): Promise<string> => {
    const fileName = utils.getFileName(ALSId)
    
    const image = new File(
        [await fs.promises.readFile(`${basePath}/_final/${fileName}.${FILE_FORMAT}`)],
        `${fileName}.${FILE_FORMAT}`,
        { type: `image/${FILE_FORMAT}` }
    )

    const metadata: MetaData = {
        description: "ALS::Alice Loves Sea NFT",
        name: `ALS-${ALSId}`,
        // image field is for image URL which is accessible via web or hashed CID(Content Id) of IPFS(분산 파일 시스템)
        // ipfs://bafybeig4zvwprykvu25...sb3evjel4/N467.png
        // to see the ipfs directly, use https://gateway.ipfs.io/ipfs/bafybeig4zvwprykvu25...sb3evjel4/N467.png
        image,
    }

    // add opensea data
    const openseaMetaData: OpenseaMetaData = {
        ...metadata,
        type: "Collectable",
        attributes: []
    }

    for (let i = 0; i < 8; i += 1) {
        const attributes = getOpenseaAttributes(ALS[i], i)
        openseaMetaData.attributes.push(attributes)
    }

    console.log('metadata', metadata)
    console.log('token', process.env.NFT_STORAGE_API_KEY)

    const nftStorage = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY! })
    const result = await nftStorage.store(metadata)
    // ipfs://bafyreihczimru3w77tved64uyrob2vc6s5kcnfs73q3a5awlpti36p56qu/metadata.json
    console.log(`result.url : ${result.url}`)
    
    return result.url
}

export const saveMetadataUrl = (url: string) => {
    console.log('writeFileSync path', `${basePath}/${constants.META_FILE_NAME}.txt`)
    fs.writeFileSync(`${basePath}/${constants.META_FILE_NAME}.txt`, `${url}\r\n`, { flag: 'a+' })
    // a+ flag opens file for reading and appending. The file is created if it does not exist.
}

export const getGatewayUrlByToken = async (ALSId: number, metaFilePath: string): Promise<string> => {
    const buffer = await fs.readFileSync(metaFilePath)
    const regExp = new RegExp('(\r?\n)?' + ALSId + '=(.*)/metadata.json', 'g')
    const matchedBuffer = buffer.toString().match(regExp)
    const tokenUri = matchedBuffer !== null ? matchedBuffer[0].slice(matchedBuffer[0].indexOf('=') + 1) : ''
    return `${ALSId}=${toGatewayURL(tokenUri).href}`
}


