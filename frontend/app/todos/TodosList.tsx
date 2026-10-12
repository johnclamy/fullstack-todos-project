'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import todoService from '@/services/crud'
import type Todo from '@/services/todos' // Adjust path as needed


interface TodosListProps {
    initialTodos: Todo[]
    initialError: string | null
}


export default function TodosList({ initialTodos, initialError }: TodosListProps) {
    const router = useRouter()
    
    // Initialize state with server-provided data
    const [todos, setTodos] = useState<Todo[]>(initialTodos)
    const [error, setError] = useState<string | null>(initialError)
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [todoIdToDelete, setTodoIdToDelete] = useState<number | null>(null)

    const openDeleteModal = (id: number) => {
        setTodoIdToDelete(id)
        setIsModalOpen(true)
        setError(null) // Clear any previous errors
    }

    const closeDeleteModal = () => {
        setIsModalOpen(false)
        setTodoIdToDelete(null)
        setError(null)
    }

    const handleDelete = async () => {
        if (todoIdToDelete === null) return

        const targetId = todoIdToDelete
        
        // 1. Optimistic Update: Remove from UI immediately for a snappy feel
        setTodos((prev) => prev.filter((t) => t.id !== targetId))
        closeDeleteModal()

        try {
            // 2. Execute Server Mutation
            await todoService.deleteTodo(targetId)
            
            // 3. Revalidate: Tell Next.js to refresh server cache to ensure consistency
            router.refresh()
        } catch (err: unknown) {
            // Revert optimistic update on failure (optional, but good UX)
            // For simplicity, we just show the error. The user can retry.
            setError(err instanceof Error ? err.message : 'Failed to delete todo.')
        }
    };

    // Allow closing the modal with the Escape key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeDeleteModal()
        }
    }

    return (      
        <main className="min-h-screen bg-base text-gray-100 p-6 md:p-12 max-w-5xl mx-auto">
            {/* Header Section */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-accent">My Todos</h1>
                <Link
                    href="/todos/add"
                    className="inline-flex items-center no-underline justify-center px-5 py-2.5 bg-accent text-base font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 shadow-lg shadow-accent/20"
                >
                    + Add New
                </Link>
            </header>

            {/* Global Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg flex items-center gap-2">
                    <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Empty State */}
            {todos.length === 0 && !error ? (
                <div className="text-center py-16 bg-surface rounded-2xl border border-elevated">
                    <span className="text-5xl mb-4 block">📝</span>
                    <h2 className="text-xl font-semibold text-white mb-2">No tasks yet!</h2>
                    <p className="text-gray-400 mb-6">Create your first task to get started.</p>
                    <Link
                        href="/todos/add"
                        className="inline-flex items-center justify-center px-5 py-2.5 bg-accent text-base font-semibold rounded-lg hover:bg-accent-hover transition-all duration-200 shadow-lg shadow-accent/20 text-white no-underline"
                    >
                        + Add New Todo
                    </Link>
                </div>
            ) : (
                <ul className="space-y-4">
                    {todos.map((todo) => (
                        <li
                            key={todo.id}
                            className={`group flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-surface border border-elevated rounded-xl transition-all duration-200 ${
                                todo.is_completed 
                                    ? 'opacity-60 border-l-4 border-l-accent' 
                                    : 'hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5'
                            }`}
                        >
                            <div className="flex-1">
                                <h3 className={`text-lg font-semibold mb-1 transition-colors ${
                                    todo.is_completed 
                                        ? 'line-through text-gray-400' 
                                        : 'text-white group-hover:text-accent'
                                }`}>
                                    {todo.title}
                                </h3>
                                {todo.description && (
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                                        {todo.description}
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                <Link
                                    href={`/todos/${todo.id}/edit`}
                                    className="px-4 py-2 text-sm font-medium no-underline text-accent border border-accent/30 rounded-lg hover:bg-accent/10 transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => openDeleteModal(todo.id)}
                                    className="px-4 py-2 text-sm font-medium text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
                                    aria-label={`Delete todo: ${todo.title}`}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Delete Confirmation Modal */}
            {isModalOpen && (
                <div
                    onClick={closeDeleteModal}
                    onKeyDown={handleKeyDown}
                    className="fixed inset-0 bg-base/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-surface border border-elevated rounded-xl p-6 max-w-md w-full shadow-2xl"
                    >
                        <h2 id="modal-title" className="text-xl font-bold text-white mb-2">
                            Delete Task?
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete this task? This action cannot be undone.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 text-sm font-medium text-gray-300 bg-elevated/50 rounded-lg hover:bg-elevated transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                // Note: Kept your 'bg-accent' theme, but consider 'bg-red-500' for destructive actions
                                className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent-hover transition-all duration-200 shadow-lg shadow-accent/20"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}