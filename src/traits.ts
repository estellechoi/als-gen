export interface Trait {
    id: number
    name: string
    rare: boolean
}

export const face: Trait[] = [
    {id: 1, name: 'chocolate-beard', rare: true},
    {id: 2, name: 'chocolate-v', rare: false},
    {id: 3, name: 'bronzed-v', rare: false},
    {id: 4, name: 'bread-beard', rare: false},
    {id: 5, name: 'bread-v', rare: false},
    {id: 6, name: 'pale-beard', rare: false},
    {id: 7, name: 'pale-v', rare: false},
    {id: 8, name: 'pink', rare: true},
]

export const hair: Trait[] = [
    {id: 1, name: 'long-curly-blond', rare: false},
    {id: 2, name: 'long-straight-blond', rare: false},
    {id: 3, name: 'shaven-blond', rare: false},
    {id: 4, name: 'bobbed-blond', rare: false},
    {id: 5, name: 'shaven-brown', rare: false},
    {id: 6, name: 'middle-curly-brown', rare: false},
    {id: 7, name: 'middle-curly-brown-tennis-band', rare: true},
    {id: 8, name: 'short-curly-brown', rare: false},
    {id: 9, name: 'long-curly-brown', rare: false},
    {id: 10, name: 'bobbed-brown', rare: false},
    {id: 11, name: 'long-straight-brown', rare: false},
    {id: 12, name: 'long-curly-black', rare: false},
    {id: 13, name: 'black-pony-tale', rare: false},
    {id: 14, name: 'shaved-white', rare: false},
    {id: 15, name: 'black-fedora', rare: false},
    {id: 16, name: 'black-fedora-w-long-blond', rare: false},
    {id: 17, name: 'white-cap', rare: false},
    {id: 18, name: 'green-beanie', rare: false},
    {id: 19, name: 'pink-bandana', rare: true},
    {id: 20, name: 'bobbed-pink', rare: true},
    {id: 21, name: 'tennis-band', rare: true},
    {id: 22, name: 'shaven-black', rare: true},
    {id: 23, name: 'gentleman-brown', rare: true},
    {id: 24, name: 'shaven-green', rare: false},
]

export const eyes: Trait[] = [
    {id: 1, name: 'black', rare: false},
    {id: 2, name: 'brown', rare: false},
    {id: 3, name: 'green', rare: false},
    {id: 4, name: 'blue', rare: false},
    {id: 5, name: 'bored', rare: true},
]

export const nose: Trait[] = [
    {id: 1, name: 'small', rare: false},
    {id: 2, name: 'medium', rare: false},
    {id: 3, name: 'big', rare: false},
]

export const lips: Trait[] = [
    {id: 1, name: 'normal', rare: false},
    {id: 2, name: 'pink', rare: true},
    {id: 3, name: 'red', rare: true},
    {id: 4, name: 'brown', rare: false},
    {id: 5, name: 'coral', rare: false},
    {id: 6, name: 'blue', rare: true},
]

export const eyewears: Trait[] = [
    {id: 1, name: 'none', rare: false},
    {id: 2, name: 'sunglasses-classic', rare: true},
    {id: 3, name: 'sunglasses-neo', rare: true},
    {id: 4, name: 'sunglasses-jordy-brown', rare: true},
    {id: 5, name: 'sunglasses-jordy-blue', rare: true},
    {id: 6, name: 'glasses', rare: true},
]

export const earings: Trait[] = [
    {id: 1, name: 'none', rare: false},
    {id: 2, name: 'gold-ring', rare: true},
    {id: 3, name: 'gold-ball', rare: false},
    {id: 4, name: 'silver-ball-chain', rare: true},
    {id: 5, name: 'silver-thin-chain', rare: true},
    {id: 6, name: 'bold-red', rare: true},
]

export const background: Trait[] = [
    {id: 1, name: 'light-grey', rare: false},
    {id: 2, name: 'grey', rare: false},
    {id: 3, name: 'night-sky', rare: true},
]
