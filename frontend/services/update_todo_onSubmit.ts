import Todo from "./todos"
import todoService from "./crud"


export default async function updateTodoOnSubmit(
    todoId: number,
    title: string,
    description: string | null,
    isCompleted: boolean,
) {
    // Trim data here, but don't touch React state.
    const payload = {
        title: title.trim(),
        description: description?.trim() || '',
        is_completed: isCompleted
    }

    // Return the updated todo. If it fails, it will naturally throw to the caller.
    return await todoService.updateTodo(todoId, payload.title, payload.description, payload.is_completed)
}
