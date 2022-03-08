import canvasPkg from 'canvas';
import * as fs from 'fs';
import * as constants from './constants';
import { saveMetadataUrl, uploadMetaData } from './nftStorage';
import { NftTobe } from "./types/common";
import * as utils from './utils';

const FILE_PATH = constants.FILE_PATH
const FILE_FORMAT = constants.FILE_FORMAT
const CANVAS_SIZE = constants.CANVAS_SIZE

const { createCanvas, loadImage } = canvasPkg

const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE)
const ctx = canvas.getContext('2d')

const saveImage = (canvas: canvasPkg.Canvas, ALSId: number) => {
    const fileName = utils.getFileName(ALSId)
    fs.writeFileSync(`${FILE_PATH}/_final/${fileName}.${FILE_FORMAT}`, canvas.toBuffer(`image/${FILE_FORMAT}`))
}

export const createImage = async (ALS: NftTobe, index: number) => {
    const ALSId = index + 1
    const face = await loadImage(`${FILE_PATH}/face/${ALS[0]}.${FILE_FORMAT}`)
    const hair = await loadImage(`${FILE_PATH}/hair/${ALS[1]}.${FILE_FORMAT}`)
    const hairFront = await loadImage(`${FILE_PATH}/hair-front/${ALS[1]}.${FILE_FORMAT}`)
    const eyes = await loadImage(`${FILE_PATH}/eyes/${ALS[2]}.${FILE_FORMAT}`)
    const nose = await loadImage(`${FILE_PATH}/nose/${ALS[3]}.${FILE_FORMAT}`)
    const lips = await loadImage(`${FILE_PATH}/lips/${ALS[4]}.${FILE_FORMAT}`)
    const eyewears = await loadImage(`${FILE_PATH}/eyewears/${ALS[5]}.${FILE_FORMAT}`)
    const earings = await loadImage(`${FILE_PATH}/earings/${ALS[6]}.${FILE_FORMAT}`)
    const background = await loadImage(`${FILE_PATH}/background/${ALS[7]}.${FILE_FORMAT}`)

    // stack images from the bottom
    await ctx.drawImage(background, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
    await ctx.drawImage(hair, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
    await ctx.drawImage(face, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
    await ctx.drawImage(eyes, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
    await ctx.drawImage(nose, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
    await ctx.drawImage(lips, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
    await ctx.drawImage(hairFront, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
    await ctx.drawImage(eyewears, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
    await ctx.drawImage(earings, 0, 0, CANVAS_SIZE, CANVAS_SIZE)

    saveImage(canvas, ALSId)
    const url = await uploadMetaData(ALS, ALSId)
    saveMetadataUrl(`${ALSId}=${url}`) // the metadata ipfs url will be used when the contract mints a token
}



