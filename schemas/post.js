export default {
    name: 'post',
    title: 'Post',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string'
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title'
            }
        },
        {
            // reference to category
            name: 'category',
            title: 'Category',
            type: 'reference',
            to: [{ type: 'category' }]

        },
        {
            name: 'coverImage',
            title: 'Cover Image',
            type: 'image'
        },
        {
            name: 'content',
            title: 'Content',
            type: 'array',
            of: [
                { type: 'block' },
                { type: 'image' }
            ]
        },
        {
            name: 'readingTime',
            title: 'Reading Time',
            type: 'number'
        },
        {
            name: 'summary',
            title: 'Summary',
            type: 'string'
        },
        {
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: [{ type: 'author' }]

        },


    ]
}