'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import todoService from "@/services/crud"


export default function AddPage() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSubmitActive, setIsSubmitActive] = useState(false)
    const router = useRouter()

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim()) {
            return
        }

        try {
            setError(null)
            setIsSubmitActive(true)
            await todoService.createTodo(title.trim(), description.trim())
            router.push('/todos')

        } catch (err: any) {
            setError(err.message || 'Failed to create todo. Please try again.')
        } finally {
            setIsSubmitActive(false)
        }
    }
}

