export interface StorysProps {
  data: {
    id: string
    moment_id: string
    describe: string
    feel: string
    reason: string
    placeName?: string
    image?: string
    date: Date
    createdAT?: Date
    updatedAT: Date
    emojiCategory?: String
    deletedAT?: number
  }
  editar: any
  excluir: any
}

/*  date: string
    month: string
    feelCategory: string
    feelEmoji: string
    reasonEmoji: string
*/
