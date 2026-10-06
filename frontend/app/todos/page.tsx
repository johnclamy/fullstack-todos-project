'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Todo from '../../services/todos'
import fetchTodos from '@/services/fetch_todos'
import todoService from '@/services/crud'


export default function Todos() {               
    const [todos, setTodos] = useState<Todo[]>([])              // Todos state provided from the fetch service
    const [error, setError] = useState<string | null>(null)     // Error state handler
    const [isOpen, setIsOpen] = useState(false)                 // Handle opening and closing a modal
    const [todoId, setTodoId] = useState<number | null>(null)   // Todo ID marked for deletion

    useEffect(() => {
        void fetchTodos(setTodos, setError)
    }, [])

    // Handlers for opening and closing the modal

    const openHandler = (id: number) => {
        setTodoId(id)
        setIsOpen(true)
    }

    const closeHandler = () => {
        setIsOpen(false)
        setTodoId(null)
    }

    const confirmDeleteHandler = async () => {
        if (todoId === null) {
            return
        }

        try {
            setError(null)
            await todoService.deleteTodo(todoId)
            // Remove from local state on success
            setTodos(prev => prev.filter(t => t.id !== todoId))
            closeHandler()

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete todo.')
        }
    }

    return (        
        <main className="min-h-screen bg-[#000814] text-gray-100 p-6 md:p-12">

            {/* Header Section */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h1 className="text-3xl md:text-4xl font-bold text-[#FFC300]">My Todo's</h1>
                <Link
                    href="/add"
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-[#FFC300] text-[#000814] font-semibold rounded-lg hover:bg-[#FFD60A] transition-all duration-200 shadow-lg shadow-[#FFC300]/20"
                >
                    + Add New
                </Link>
            </header>

            {/* Error Display */}
            {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg">
                    {error}
                </div>
            )}

            {/* Empty State */}
            {todos.length === 0 && !error ? (
                <div className="text-center py-16 bg-[#001D3D] rounded-2xl border border-[#003566]">
                    <span className="text-5xl mb-4 block">📝</span>
                    <h2 className="text-xl font-semibold text-white mb-2">No tasks yet!</h2>
                    <p className="text-gray-400">Create your first task to get started.</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {todos.map((todo) => (
                        // Add conditional class if completed
                        <li
                            key={todo.id}
                            className={`group flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-[#001D3D] border border-[#003566] rounded-xl transition-all duration-200 ${todo.is_completed 
                                ? 'opacity-60 border-l-4 border-l-[#FFC300]' 
                                : 'hover:border-[#FFC300]/50 hover:shadow-lg hover:shadow-[#FFC300]/5'
                            }`}
                        >
                            <div className="flex-1">
                                <h3 className={`text-lg font-semibold transition-colors ${todo.is_completed 
                                    ? 'line-through text-gray-400' 
                                    : 'text-white group-hover:text-[#FFC300]'
                                }`}>
                                    {todo.title}
                                </h3>
                                {todo.description && (
                                    <p className="text-sm text-gray-400 mt-1">{todo.description}</p>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-3 mt-4 sm:mt-0">
                                <Link
                                    href={`/todos/${todo.id}/edit`}
                                    className="px-4 py-2 text-sm font-medium text-[#FFC300] border border-[#FFC300]/30 rounded-lg hover:bg-[#FFC300]/10 transition-colors"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => openHandler(todo.id)}
                                    className="px-4 py-2 text-sm font-medium text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Delete Confirmation Modal */}
            {isOpen && (
                <div
                    onClick={closeHandler}
                    className="fixed inset-0 bg-[#000814]/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#001D3D] border border-[#003566] rounded-xl p-6 max-w-md w-full shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-white mb-2">Delete Task?</h2>
                        <p className="text-gray-400 mb-6">
                            Are you sure you want to delete this task? This action cannot be undone.
                        </p>
                        {error && (
                            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-200 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={closeHandler}
                                className="px-4 py-2 text-sm font-medium text-gray-300 bg-[#003566]/50 rounded-lg hover:bg-[#003566] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteHandler}
                                className="px-4 py-2 text-sm font-medium text-[#000814] bg-[#FFC300] rounded-lg hover:bg-[#FFD60A] transition-all duration-200 shadow-lg shadow-[#FFC300]/20"
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