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
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading todo details...</p>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white shadow-sm rounded-lg p-8">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Update Todo</h1>
                        <p className="text-gray-600">Edit the details of your todo below.</p>
                    </header>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md" role="alert">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Todo Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400"
                                placeholder="Enter todo title"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="desc"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 resize-none"
                                placeholder="Enter todo description (optional)"
                                rows={4}
                            />
                        </div>

                        {/* New Completion Checkbox */}
                        <div className="flex items-center">
                            <input
                                id="completed"
                                type="checkbox"
                                checked={isCompleted}
                                onChange={(e) => setIsCompleted(e.target.checked)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="completed" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                                Mark as completed
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button 
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 px-6 py-2.5 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitActive}
                                className="flex-1 px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitActive ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    )
}
