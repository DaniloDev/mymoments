import { ObjectSchema } from 'realm'

const StorySchema: ObjectSchema = {
  name: 'Story',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    moment_id: 'string',
    describe: 'string',
    feel: 'string',
    reason: 'string',
    placeName: {
      type: 'string',
      optional: true
    },
    image: {
      type: 'string',
      optional: true
    },
    date: 'date',
    emojiCategory: 'string'
  }
}

export default StorySchema

/* 
      date: Date,
      month: Date,
      feelCategory: 'string',
      feelEmoji: 'string',
      reasonEmoji: 'string',

*/
