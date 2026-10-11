import todoService from "./crud"


export default async function fetchTodo(todoId: number) {
    // Simply return the data. Let the component handle state updates.
    return await todoService.getTodo(todoId)
}
