import * as fs from 'fs';
import { File, NFTStorage, toGatewayURL } from 'nft.storage';
import * as constants from './constants';
import { background, body, face } from './traits';
import { NftTobe } from './types/common';
import * as utils from './utils';

const FILE_PATH = constants.FILE_PATH
const FILE_FORMAT = constants.FILE_FORMAT

const client = new NFTStorage({ token: process.env.NFT_STORAGE_API_KEY! })

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

const getOpenseaAttributes = (traitId: number, k: number): OpenseaAttributes => {
    const attributes: OpenseaAttributes = { trait_type: '', value: '' }
    let trait_type: string
    let value: string

    switch(k) {
        case 0:
            trait_type = 'face'
            value = face[traitId - 1].name
            break
        case 1:
            trait_type = 'body'
            value = body[traitId - 1].name
            break
        case 2:
            trait_type = 'background'
            value = background[traitId - 1].name
            break
        default:
            trait_type = ''
            value = ''
    }

    attributes.trait_type = trait_type
    attributes.value = value
    
    return attributes
}

export const uploadMetaData = async (ALS: NftTobe, ALSId: number): Promise<string> => {
    const fileName = utils.getFileName(ALSId)
    const image = new File(
        [await fs.promises.readFile(`${FILE_PATH}/_final/${fileName}.${FILE_FORMAT}`)],
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

    for (let i = 0; i < 3; i += 1) {
        const attributes = getOpenseaAttributes(ALS[i], i)
        openseaMetaData.attributes.push(attributes)
    }

    const result = await client.store(metadata)
    // ipfs://bafyreihczimru3w77tved64uyrob2vc6s5kcnfs73q3a5awlpti36p56qu/metadata.json
    console.log(`result.url : ${result.url}`)
    
    return result.url
}

export const saveMetadataUrl = (url: string) => {
    const fileName = constants.META_FILE_NAME
    fs.writeFileSync(`./${fileName}.txt`, `${url}\r\n`, { flag: 'a+' })
    // a+ flag opens file for reading and appending. The file is created if it does not exist.
}

export const getGatewayUrlByToken = async (ALSId: number, metaFilePath: string): Promise<string> => {
    const buffer = await fs.readFileSync(metaFilePath)
    const regExp = new RegExp('(\r?\n)?' + ALSId + '=(.*)/metadata.json', 'g')
    const matchedBuffer = buffer.toString().match(regExp)
    const tokenUri = matchedBuffer !== null ? matchedBuffer[0].slice(matchedBuffer[0].indexOf('=') + 1) : ''
    return `${ALSId}=${toGatewayURL(tokenUri).href}`
}


