import { Dispatch, SetStateAction } from "react"
import Todo from "./todos"
import todoService from "./crud"


export default async function updateTodo(
    todoId: number,
    title: string,
    description: string | null,
    isCompleted: boolean,
    errorHandler: Dispatch<SetStateAction<string | null>>,
    submitActiveHandler: Dispatch<SetStateAction<boolean>>
) {
    try {
        submitActiveHandler(true)
        const data: Todo = await todoService.updateTodo(todoId, title.trim(), description?.trim() || '', isCompleted)

        errorHandler(null)
        return data

    } catch (err: unknown) {
        errorHandler(err instanceof Error ? err.message : "Failed to update todo")
        throw err
    } finally {
        submitActiveHandler(false)
    }
}
