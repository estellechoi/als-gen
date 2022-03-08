import canvasPkg from 'canvas';
import * as fs from 'fs';
import * as constants from './constants';
import { saveMetadataUrl, uploadMetaData } from './nftStorage';
import { NftTobe } from "./types/common";
import * as utils from './utils';

const FILE_PATH = constants.FILE_PATH
const FILE_FORMAT = constants.FILE_FORMAT

const { createCanvas, loadImage } = canvasPkg

const canvas = createCanvas(500, 500)
const ctx = canvas.getContext('2d')

const saveImage = (canvas: canvasPkg.Canvas, ALSId: number) => {
    const fileName = utils.getFileName(ALSId)
    fs.writeFileSync(`${FILE_PATH}/_final/${fileName}.${FILE_FORMAT}`, canvas.toBuffer(`image/${FILE_FORMAT}`))
}

export const createImage = async (ALS: NftTobe, index: number) => {
    const ALSId = index + 1
    const face = await loadImage(`${FILE_PATH}/face/${ALS[0]}.${FILE_FORMAT}`)
    const body = await loadImage(`${FILE_PATH}/body/${ALS[1]}.${FILE_FORMAT}`)
    const background = await loadImage(`${FILE_PATH}/background/${ALS[2]}.${FILE_FORMAT}`)

    await ctx.drawImage(background, 0, 0, 500, 500)
    await ctx.drawImage(body, 0, 0, 500, 500)
    await ctx.drawImage(face, 0, 0, 500, 500)
    
    saveImage(canvas, ALSId)
    const url = await uploadMetaData(ALS, ALSId)
    saveMetadataUrl(`${ALSId}=${url}`) // the metadata ipfs url will be used when the contract mints a token
}



