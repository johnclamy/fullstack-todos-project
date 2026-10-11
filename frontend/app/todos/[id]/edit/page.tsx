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
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Validate ID to prevent NaN API calls
        if (isNaN(id)) {
            setError("Invalid Todo ID")
            setIsLoading(false)
            return
        }

        const loadTodo = async () => {
            try {
                setIsLoading(true)
                const data = await fetchTodo(id)
                
                // Populate form with fetched data
                setTitle(data.title)
                setDescription(data.description)
                setIsCompleted(data.is_completed)
                setError(null)
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : "Failed to fetch todo")
            } finally {
                setIsLoading(false)
            }
        }

        loadTodo()

    }, [id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim()) return

        setIsSubmitActive(true)
        setError(null) // Clear previous errors

        try {
            await updateTodoOnSubmit(id, title, description, isCompleted)
            router.push(`/todos/`)
        } catch (err: unknown) {
            // Error is now handled cleanly in one place
            setError(err instanceof Error ? err.message : 'Failed to update todo. Please try again.')
        } finally {
            setIsSubmitActive(false)
        }
    }

    // Show loading state while fetching initial data
    if (isLoading) {
        return (
            <main>
                <p>Loading todo details...</p> {/* Replace with a Skeleton UI if desired */}
            </main>
        )
    }

    return (
        <main>
            <div>
                <header>
                    <h1>Update Todo</h1>
                    <p>Edit the details of your todo below.</p>
                </header>

                {error && <div role="alert">{error}</div>}

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
