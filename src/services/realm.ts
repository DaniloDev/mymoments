import Realm from 'realm'
import StorySchema from '../Schemas/StorySchema'

const getRealm = (storySchema: any = StorySchema) => {
  return Realm.open({
    schema: [storySchema]
  })
}

export default getRealm
