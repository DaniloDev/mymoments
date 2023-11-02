import { ObjectSchema } from 'realm'

const StorySchema: ObjectSchema = {
  name: 'Story',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    userId: 'string',
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
    createdAT: { type: 'date', optional: true },
    updatedAT: 'date',
    emojiCategory: 'string',
    deletedAT: { type: 'int', optional: true }
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
