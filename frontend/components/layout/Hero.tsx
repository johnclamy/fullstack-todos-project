'use client'

import Link from 'next/link'
import { Plus, ListChecks, Sparkles } from 'lucide-react'


export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-slate-950 pt-2 pb-16 sm:pt-4 sm:pb-20">
        <div className="absolute inset-0 -z-10">        
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            {/* Soft gradient glow */}
            <div className="absolute left-1/2 top-0 -z-10 h-125 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20" />
        </div>

        <div className="mx-auto w-full max-w-5xl px-6 lg:px-8 text-center">
            {/* Badge / Kicker */}
            <div className="mb-8 flex justify-center">
                <div className="relative flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <span>The ultimate productivity companion</span>
                </div>
            </div>

            {/* Main Call to Action */}
            <h1 className="md:mt-4 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
                <span className="block text-elevated">Set your goals.</span>
                <span className="relative block whitespace-nowrap">
                    <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                        Get Things done.
                    </span>
                </span>
            </h1>

            {/* Descriptive Paragraph */}
            <p className="mx-auto mt-6 max-w-2xl px-2 text-sm/6 text-zinc-800 leading-6 dark:text-slate-400 sm:px-0 sm:text-lg sm:leading-8">
                Experience a beautifully crafted task manager designed to eliminate friction from your daily workflow. 
                Organize your priorities, track your progress, and turn your ambitions into reality with an interface 
                that feels as good as it looks. Stop planning, start achieving.
            </p> 

            {/* Hero Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                {/* Primary CTA: Action-oriented (Opens Modal/Form) */}
                <button
                    type="button"
                    className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/40 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-full sm:w-auto"
                >
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" />
                    Add Your Todo
                </button>

                {/* Secondary CTA: Navigation-oriented (Uses next/link) */}
                <Link
                    href="/todos"
                    className="group inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 no-underline bg-white dark:bg-slate-900 px-7 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 w-full sm:w-auto"
                >
                    View My Todos
                    <ListChecks className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" />
                </Link>
            </div>          
        </div>
    </section>
  )
}
