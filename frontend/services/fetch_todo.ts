import { Dispatch, SetStateAction } from "react"
import todoService from "./crud"


export default async function fetchTodo(
    todoId: number,
    titleHandler: Dispatch<SetStateAction<string>>,
    descHandler: Dispatch<SetStateAction<string>>,
    isCompletedHandler: Dispatch<SetStateAction<boolean>>,
    errorHandler: Dispatch<SetStateAction<string | null>>
){
    try {        
        const data = await todoService.getTodo(todoId)

        errorHandler(null)
        titleHandler(data.title)
        descHandler(data.description)
        isCompletedHandler(data.is_completed)

    } catch (err: unknown) {
        errorHandler(err instanceof Error ? err.message : "Failed to fetch todo")
    }
}
