'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import todoService, { type Author } from "@/services/crud"


export default function EditTodo() {
    const params = useParams()
    const id = Number(params.id)
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [authors, setAuthors] = useState<Author[]>([])
    const [authorId, setAuthorId] = useState('')
    const [isCompleted, setIsCompleted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isSubmitActive, setIsSubmitActive] = useState(false)
    const [isLoadingAuthors, setIsLoadingAuthors] = useState(true)
}
