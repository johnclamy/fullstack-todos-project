import { Dispatch, SetStateAction } from "react"
import Todo from "./todos"
import todoService from "./crud"


export default async function fetchTodos(
    todosHandler: Dispatch<SetStateAction<Todo[]>>,
    errorHandler: Dispatch<SetStateAction<string | null>>) {
    try {
        errorHandler(null)
        const data = await todoService.getTodos()
        todosHandler(data)

    } catch (err) {
        errorHandler(err instanceof Error ? err.message : 'Failed to fetch todos.')
    }
}
