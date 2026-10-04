'use client'

import Link from 'next/link'
import { Plus, ListChecks, Sparkles } from 'lucide-react'


export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-slate-950 pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="absolute inset-0 -z-10">        
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            {/* Soft gradient glow */}
            <div className="absolute left-1/2 top-0 -z-10 h-125 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/20" />
        </div>

        <div className="mx-auto max-w-5xl px-6 lg:px-8 text-center">
            {/* Badge / Kicker */}
            <div className="mb-8 flex justify-center">
                <div className="relative flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-4 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <span>The ultimate productivity companion</span>
                </div>
            </div>

            {/* Main Call to Action */}
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
                Set your goals.{' '}
                <span className="relative whitespace-nowrap">
                    <span className="relative z-10 text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                        Get Things done.
                    </span>
                </span>
            </h1>

            {/* Descriptive Paragraph */}
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
                Experience a beautifully crafted task manager designed to eliminate friction from your daily workflow. 
                Organize your priorities, track your progress, and turn your ambitions into reality with an interface 
                that feels as good as it looks. Stop planning, start achieving.
            </p>           
        </div>
    </section>
  )
}
