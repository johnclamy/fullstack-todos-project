import { Author } from "./authors"


export interface Todo {
    id: number
    title: string
    description: string
    author_id: number
    author: Author
    is_completed: boolean
    created_at: string
    updated_at: string
}
