"use client"

import Link from "next/link"
import { ListTodo, Menu, X } from "lucide-react"
import { useState } from "react"


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* Logo & Title */}
                <Link href="/" className="navbar-logo">
                    <ListTodo size={28} className="navbar-logo-icon" />
                    <span className="navbar-logo-text">MyTodos</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    <Link href="/" className="navbar-link">
                        Home
                    </Link>
                    <Link href="/todos" className="navbar-link">
                        Todos
                    </Link>
                    <Link href="/add-todo" className="navbar-link navbar-link-cta">
                        Add Todo
                    </Link>
                    <Link href="/auth" className="navbar-link">
                        Register / Login
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="navbar-mobile-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="navbar-mobile-links">
                    <Link href="/" className="navbar-mobile-link" onClick={() => setIsOpen(false)}>
                        Home
                    </Link>
                    <Link href="/todos" className="navbar-mobile-link" onClick={() => setIsOpen(false)}>
                        Todos
                    </Link>
                    <Link href="/add-todo" className="navbar-mobile-link navbar-mobile-link-cta" onClick={() => setIsOpen(false)}>
                        Add Todo
                    </Link>
                    <Link href="/auth" className="navbar-mobile-link" onClick={() => setIsOpen(false)}>
                        Register / Login
                    </Link>
                </div>
            )}
        </nav>
    )
}