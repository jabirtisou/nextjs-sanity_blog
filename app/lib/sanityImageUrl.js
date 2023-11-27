import { client } from './sanity'
import ImageUrlBuilder from '@sanity/image-url'


const builder = ImageUrlBuilder(client)


export function urlFor(source) {
    return builder.image(source)
}   