import { ObjectSchema } from 'realm'

const MomentSchema: ObjectSchema = {
  name: 'Moment',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
    userId: 'string',
    name: 'string',
    describe: {
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
    deletedAT: { type: 'int', optional: true }
    // story: 'Story[]'
  }
}

export default MomentSchema
