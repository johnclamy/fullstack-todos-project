'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import todoService, { type Author } from "@/services/crud";


interface AddTodoFormProps {
    initialAuthors: Author[];
}


export default function AddTodoForm({ initialAuthors }: AddTodoFormProps) {
    const router = useRouter();
    
    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [authorId, setAuthorId] = useState<string>(initialAuthors[0]?.id.toString() ?? "");
    
    // UI state
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const hasAuthors = initialAuthors.length > 0;

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !authorId || !hasAuthors) return;

        try {
            setError(null);
            setIsSubmitting(true);
            
            await todoService.createTodo(title.trim(), description.trim(), Number(authorId));
            
            // Refresh the router cache to ensure the todos list is up-to-date
            router.refresh();
            router.push("/todos");
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to create todo. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Early return for better UX if no authors exist
    if (!hasAuthors) {
        return (
            <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 border border-gray-100 text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Cannot Add Todo</h1>
                    <p className="text-gray-600 mb-6">
                        No authors are available. Please create an author before adding a todo.
                    </p>
                    <button
                        onClick={() => router.push("/authors")} // Adjust route to your actual author creation page
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                    >
                        Create an Author
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Add New Todo</h1>
                        <p className="mt-2 text-gray-600">Fill in the details below to create a new task.</p>
                    </header>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
                            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <label htmlFor="author" className="block text-sm font-semibold text-gray-700">
                                Author <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="author"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                value={authorId}
                                onChange={(e) => setAuthorId(e.target.value)}
                                required
                            >
                                {initialAuthors.map((author) => (
                                    <option key={author.id} value={author.id}>
                                        {author.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                                Task Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                placeholder="e.g., Buy groceries"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="desc" className="block text-sm font-semibold text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="desc"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                                placeholder="Add some details..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                            />
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                className="w-full sm:w-auto px-6 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !title.trim()}
                                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Creating...
                                    </>
                                ) : (
                                    "Create Todo"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}