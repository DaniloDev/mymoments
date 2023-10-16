export interface MomentsProps {
  data: {
    id: string
    name: string
    describe?: string
    image?: string
    date: Date
    updatedAT: Date
  }
  editar: any
  excluir: any
}
