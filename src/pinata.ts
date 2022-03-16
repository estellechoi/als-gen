import pinataSDK from '@pinata/sdk'
import * as constants from './constants'

const IPFSUrl = constants.PINATA_IPFS_URL

const pinata = pinataSDK(process.env.PINATA_API_KEY!, process.env.PINATA_API_SECRET!)