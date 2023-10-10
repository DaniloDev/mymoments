import Realm from 'realm'
import Momentschema from '../Schemas/MomentSchema'
import StorySchema from '../Schemas/StorySchema'

const getRealm = async () =>
  await Realm.open({
    path: 'myrealm',
    schema: [Momentschema, StorySchema]
  })

export default getRealm
