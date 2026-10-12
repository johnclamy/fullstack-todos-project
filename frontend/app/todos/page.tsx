import todoService from "@/services/crud"
import TodosList from "./TodosList"
import type Todo from "@/services/todos"


export default async function TodosPage() {
    let initialTodos: Todo[] = [];
    let initialError: string | null = null;

    try {
        initialTodos = await todoService.getTodos()
    } catch (err) {
        console.error("Failed to fetch todos:", err)
        initialError = err instanceof Error ? err.message : "Failed to fetch todos. Please try again later."
    }

    return <TodosList initialTodos={initialTodos} initialError={initialError} />
}
