import todoService from "@/services/crud"
import AddTodoForm from "./AddTodoForm"


export default async function AddPage() {
    // Fetch authors on the server. This eliminates client-side loading states.
    const authors = await todoService.getAuthors().catch((err) => {
        console.error("Failed to fetch authors:", err)
        return []
    })

    return <AddTodoForm initialAuthors={authors} />
}
