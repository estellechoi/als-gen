import canvasPkg from 'canvas';
import * as fs from 'fs';
import path from 'path';
import * as constants from './constants';
import { saveMetadataUrl, uploadMetaData } from './nftStorage';
import { NftTobe } from "./types/common";
import * as utils from './utils';

const FILE_PATH = constants.FILE_PATH
const FILE_FORMAT = constants.FILE_FORMAT
const CANVAS_SIZE = constants.CANVAS_SIZE

const __dirname = path.resolve()
const basePath = `${__dirname}/${FILE_PATH}`

const { createCanvas, loadImage } = canvasPkg

const canvas = createCanvas(CANVAS_SIZE, CANVAS_SIZE)
const ctx = canvas.getContext('2d')

const saveImage = (canvas: canvasPkg.Canvas, ALSId: number) => {
    const fileName = utils.getFileName(ALSId)
    fs.writeFileSync(`${basePath}/_final/${fileName}.${FILE_FORMAT}`, canvas.toBuffer(`image/${FILE_FORMAT}`))
}

export const createImage = async (ALS: NftTobe, index: number) => {
    const ALSId = index + 1
    const face = await loadImage(`${basePath}/face/${ALS[0]}.${FILE_FORMAT}`)
    const hair = await loadImage(`${basePath}/hair/${ALS[1]}.${FILE_FORMAT}`)
    const hairFront = await loadImage(`${basePath}/hair-front/${ALS[1]}.${FILE_FORMAT}`)
    const eyes = await loadImage(`${basePath}/eyes/${ALS[2]}.${FILE_FORMAT}`)
    const nose = await loadImage(`${basePath}/nose/${ALS[3]}.${FILE_FORMAT}`)
    const lips = await loadImage(`${basePath}/lips/${ALS[4]}.${FILE_FORMAT}`)
    const eyewears = await loadImage(`${basePath}/eyewears/${ALS[5]}.${FILE_FORMAT}`)
    const earings = await loadImage(`${basePath}/earings/${ALS[6]}.${FILE_FORMAT}`)
    const background = await loadImage(`${basePath}/background/${ALS[7]}.${FILE_FORMAT}`)

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
    await saveMetadataUrl(`${ALSId}=${url}`) // the metadata ipfs url will be used when the contract mints a token
}



