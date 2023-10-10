import { ObjectSchema } from 'realm'

const MomentSchema: ObjectSchema = {
  name: 'Moment',
  primaryKey: 'id',
  properties: {
    id: { type: 'int', indexed: true },
    name: 'string',
    describe: 'string',
    date: 'date',
    story: 'Story[]'
  }
}

export default MomentSchema
