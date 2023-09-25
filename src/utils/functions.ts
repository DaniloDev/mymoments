import getRealm from "../services/realm"

export const getID = async(db:string) => {
    const realm = await getRealm()
    const id = realm.objects(db).sorted('id',true).length > 0
    ? realm.objects(db).sorted('id', true)[0].id + 1 : 1
    return id
  }
