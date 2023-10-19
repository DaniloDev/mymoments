export interface MomentsProps {
  data: {
    id: string
    name: string
    describe?: string
    image?: string
    date: Date
    createdAT?: Date
    updatedAT: Date
    deletedAT?: number
  }
  editar: any
  excluir: any
}
