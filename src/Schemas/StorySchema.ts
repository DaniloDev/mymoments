import Realm from 'realm'

export default class StorySchema extends Realm.Object {
  static schema = {
    name: 'Story',
    primaryKey: 'id',
    properties: {
      id: { type: 'int', indexed: true },
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
}

/* 
      date: Date,
      month: Date,
      feelCategory: 'string',
      feelEmoji: 'string',
      reasonEmoji: 'string',

*/
