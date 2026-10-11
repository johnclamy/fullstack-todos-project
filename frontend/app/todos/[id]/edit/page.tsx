'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import fetchTodo from "@/services/fetch_todo"
import updateTodoOnSubmit from "@/services/update_todo_onSubmit"


export default function EditTodo() {
    const params = useParams()
    const id = Number(params.id)
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [isCompleted, setIsCompleted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitActive, setIsSubmitActive] = useState(false)

    useEffect(() => {
        fetchTodo(id, setTitle, setDescription, setIsCompleted, setError)
    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        try {
            await updateTodoOnSubmit(id, title, description, isCompleted, setError, setIsSubmitActive)
            router.push(`/todos/`)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update todo. Please try again.')
        }
    }

    return (
        <main>
            <div>
                <header>
                    <h1>Update Todo</h1>
                    <p>Edit the details of your todo below.</p>
                </header>

                {error && <div className="form-page__error">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Todo Title *</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="desc">Description</label>
                        <textarea
                            id="desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    {/* New Completion Checkbox */}
                    <div>
                        <label>
                            <input
                                type="checkbox"
                                checked={isCompleted}
                                onChange={(e) => setIsCompleted(e.target.checked)}
                            />
                            <span>Mark as completed</span>
                        </label>
                    </div>

                    <div>
                        <button type="button" onClick={() => router.back()}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitActive}>
                            {isSubmitActive ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}
