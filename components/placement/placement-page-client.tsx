"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Briefcase, Building2 } from "lucide-react"
import type { Opportunity, PlacementFilters } from "./types"
import { PlacementCard } from "./placement-card"
import { PlacementSection } from "./placement-section"
import { ApplicationTips } from "./application-tips"
import { SearchBar } from "./search-bar"
import { ParticleCard, GlobalSpotlight } from "@/components/MagicBento"

export function PlacementPageClient() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [source, setSource] = useState<string>("curated")
    const [isMobile, setIsMobile] = useState(false)
    const [filters, setFilters] = useState<PlacementFilters>({
        query: "",
        type: "all",
        domain: "All Domains",
    })

    const internshipGridRef = useRef<HTMLDivElement>(null)
    const fullTimeGridRef = useRef<HTMLDivElement>(null)

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
        }

        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const fetchOpportunities = useCallback(async () => {
        setIsLoading(true)
        try {
            const params = new URLSearchParams()
            if (filters.query) params.set("query", filters.query)
            if (filters.type !== "all") params.set("type", filters.type)
            if (filters.domain !== "All Domains") params.set("domain", filters.domain)

            const res = await fetch(`/api/placements?${params.toString()}`)
            const data = await res.json()
            setOpportunities(data.results)
            setSource(data.source)
        } catch {
            console.error("[Placements] Failed to fetch opportunities")
        } finally {
            setIsLoading(false)
        }
    }, [filters])

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchOpportunities()
        }, 300)
        return () => clearTimeout(debounce)
    }, [fetchOpportunities])

    const internships = opportunities.filter((o) => o.type === "internship")
    const fullTime = opportunities.filter((o) => o.type === "full-time")

    const showInternships = filters.type === "all" || filters.type === "internship"
    const showFullTime = filters.type === "all" || filters.type === "full-time"

    return (
        <main className="mx-auto max-w-5xl px-6 pb-16 pt-20">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">
                    Placement Openings
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                    Latest internship and full-time opportunities
                </p>
                {source === "jsearch" && (
                    <span className="mt-2 inline-block rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs text-emerald-400 border border-emerald-500/30">
                        Live data from JSearch API
                    </span>
                )}
            </header>

            <SearchBar
                filters={filters}
                onFiltersChange={setFilters}
                isLoading={isLoading}
            />

            {/* Internships Section */}
            {showInternships && (
                <section className="mt-10">
                    <div className="mb-6 flex items-center gap-3">
                        <Briefcase className="h-6 w-6 text-emerald-400" />
                        <h2 className="text-xl font-bold text-white">Internships</h2>
                    </div>
                    <div ref={internshipGridRef} className="grid grid-cols-1 gap-5 md:grid-cols-2 relative bento-section">
                        <GlobalSpotlight
                            gridRef={internshipGridRef}
                            enabled={!isMobile}
                            spotlightRadius={200}
                            glowColor="16, 185, 129"
                            disableAnimations={isMobile}
                        />
                        {isLoading ? (
                            <>
                                <CardSkeleton />
                                <CardSkeleton />
                            </>
                        ) : internships.length > 0 ? (
                            internships.map((opp) => (
                                <ParticleCard
                                    key={opp.id}
                                    disableAnimations={isMobile}
                                    particleCount={10}
                                    enableTilt={false}
                                    clickEffect={true}
                                    enableMagnetism={true}
                                    glowColor="16, 185, 129"
                                >
                                    <PlacementCard opportunity={opp} />
                                </ParticleCard>
                            ))
                        ) : (
                            <p className="col-span-2 text-sm text-gray-400">
                                No internships found. Try adjusting your filters.
                            </p>
                        )}
                    </div>
                </section>
            )}

            {/* Full-Time Section */}
            {showFullTime && (
                <section className="mt-10">
                    <div className="mb-6 flex items-center gap-3">
                        <Building2 className="h-6 w-6 text-violet-400" />
                        <h2 className="text-xl font-bold text-white">Full-Time Positions</h2>
                    </div>
                    <div ref={fullTimeGridRef} className="grid grid-cols-1 gap-5 md:grid-cols-2 relative bento-section">
                        <GlobalSpotlight
                            gridRef={fullTimeGridRef}
                            enabled={!isMobile}
                            spotlightRadius={200}
                            glowColor="139, 92, 246"
                            disableAnimations={isMobile}
                        />
                        {isLoading ? (
                            <>
                                <CardSkeleton />
                                <CardSkeleton />
                            </>
                        ) : fullTime.length > 0 ? (
                            fullTime.map((opp) => (
                                <ParticleCard
                                    key={opp.id}
                                    disableAnimations={isMobile}
                                    particleCount={10}
                                    enableTilt={false}
                                    clickEffect={true}
                                    enableMagnetism={true}
                                    glowColor="139, 92, 246"
                                >
                                    <PlacementCard opportunity={opp} />
                                </ParticleCard>
                            ))
                        ) : (
                            <p className="col-span-2 text-sm text-gray-400">
                                No full-time positions found. Try adjusting your filters.
                            </p>
                        )}
                    </div>
                </section>
            )}

            <ApplicationTips />
        </main>
    )
}

function CardSkeleton() {
    return (
        <div className="animate-pulse rounded-lg border border-[var(--border)] bg-[var(--card)] p-5">
            <div className="flex items-start justify-between">
                <div className="h-5 w-48 rounded bg-gray-700" />
                <div className="h-6 w-20 rounded-full bg-gray-700" />
            </div>
            <div className="mt-3 h-4 w-24 rounded bg-gray-700" />
            <div className="mt-5 flex flex-col gap-2">
                <div className="h-4 w-32 rounded bg-gray-700" />
                <div className="h-4 w-36 rounded bg-gray-700" />
                <div className="h-4 w-40 rounded bg-gray-700" />
            </div>
            <div className="mt-5 h-10 rounded-lg bg-gray-700" />
        </div>
    )
}
