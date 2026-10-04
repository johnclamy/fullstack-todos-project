import { ListChecks, Pencil, Zap } from 'lucide-react'


const features = [
  {
    name: 'List based',
    description:
      'Organize your tasks in clean, intuitive lists that keep everything structured and easy to navigate.',
    icon: ListChecks,
  },
  {
    name: 'Editable',
    description:
      'Update, reorder, and refine your tasks on the fly with inline editing that feels effortless.',
    icon: Pencil,
  },
  {
    name: 'Very fast',
    description:
      'Built for speed. Instant updates, smooth interactions, and zero lag keep you in the flow.',
    icon: Zap,
  },
]


export default function Features() {
    return (
        <section className="relative w-full bg-slate-50 dark:bg-slate-900/50 pt-12 pb-20 lg:py-22">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* Section Header */}
                <header className="mx-auto max-w-2xl text-center mb-16">
                    {/* <h2 className="text-sm font-semibold uppercase tracking-widest text-accent">
                        Features
                    </h2> */}
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Everything you need to stay productive
                    </p>
                    <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
                        A simple, powerful tool designed to help you focus on what matters most.
                    </p>
                </header>

                {/* Cards Grid */}
                <article className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
                    {features.map((feature) => (
                        <section
                            key={feature.name}
                            className="group relative flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-900"
                        >
                            <figure className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-100 dark:ring-indigo-900/50 transition-transform duration-300 group-hover:scale-110">
                                <feature.icon className="h-6 w-6" aria-hidden="true" />
                            </figure>

                            {/* Title */}
                            <h3 className="text-xl font-semibold text-accent">
                                {feature.name}
                            </h3>

                            {/* Description */}
                            <p className="text-base leading-relaxed dark:text-slate-400">
                                {feature.description}
                            </p>
                        </section>
                    ))}   
                </article>                
            </div>
        </section>
    )
}
