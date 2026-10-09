import Todo from './todos'


const API_URL = process.env.NEXT_PUBLIC_API_URL


interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

export interface Author {
    id: number;
    name: string;
    email: string;
}


const todoService = {
    // Get all todos
    async getTodos(): Promise<Todo[]> {
        const result = await fetch(`${API_URL}/todos`)
        const json: ApiResponse<Todo[]> = await result.json()

        return json.data
    },

    // Get a todo
    async getTodo(id: number): Promise<Todo> {
        const result = await fetch(`${API_URL}/todos/${id}`)
        const json: ApiResponse<Todo> = await result.json()

        if (!result.ok) {
            throw new Error(json.message || 'Failed to fetch todo')
        }

        return json.data
    },

    async getAuthors(): Promise<Author[]> {
        const result = await fetch(`${API_URL}/authors`)
        const json: ApiResponse<Author[]> = await result.json()

        if (!result.ok) {
            throw new Error(json.message || 'Failed to fetch authors')
        }

        return json.data
    },

    // Create a todo
    async createTodo(title: string, description: string, authorId: number): Promise<Todo> {
        const result = await fetch(`${API_URL}/todos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, author_id: authorId }),
        })
        const json: ApiResponse<Todo> & { detail?: string | { msg: string }[] } = await result.json()

        if (!result.ok) {
            const detail = Array.isArray(json.detail)
                ? json.detail.map((item) => item.msg).join(', ')
                : json.detail
            throw new Error(json.message || detail || 'Failed to create todo')
        }
        return json.data
    },

    // Update a todo
    async updateTodo(
        id: number,
        title: string,
        description: string,
        is_completed: boolean): Promise<Todo> {
        const result = await fetch(`${API_URL}/todos/update/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, is_completed }),
        })
        const json: ApiResponse<Todo> = await result.json()

        if (!result.ok) {
            throw new Error(json.message || 'Failed to update todo')
        }

        return json.data;
    },

    // Delete a todo
    async deleteTodo(id: number): Promise<void> {
        const result = await fetch(`${API_URL}/todos/delete/${id}`, {
            method: 'DELETE',
        })
        const json: ApiResponse<null> = await result.json();
        if (!result.ok) throw new Error(json.message || 'Failed to delete todo')
    }
}


export default todoService
