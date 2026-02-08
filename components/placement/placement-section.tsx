import type { ReactNode } from "react"

interface PlacementSectionProps {
    icon: ReactNode
    title: string
    children: ReactNode
}

export function PlacementSection({ icon, title, children }: PlacementSectionProps) {
    return (
        <section className="mt-10">
            <div className="mb-6 flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {children}
            </div>
        </section>
    )
}
