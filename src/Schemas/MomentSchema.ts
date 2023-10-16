import { ObjectSchema } from 'realm'

const MomentSchema: ObjectSchema = {
  name: 'Moment',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', indexed: true },
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
    updatedAT: 'date'
    // story: 'Story[]'
  }
}

export default MomentSchema
