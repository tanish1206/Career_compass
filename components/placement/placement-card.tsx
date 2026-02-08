"use client"

import { MapPin, DollarSign, Calendar } from "lucide-react"
import Card from "@/components/Card"
import type { Opportunity } from "./types"

interface PlacementCardProps {
    opportunity: Opportunity
}

export function PlacementCard({ opportunity }: PlacementCardProps) {
    const isInternship = opportunity.type === "internship"
    const badgeLabel = isInternship ? "Internship" : "Full-Time"

    return (
        <Card hover className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">
                    {opportunity.title}
                </h3>
                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium border ${isInternship
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-violet-500/15 text-violet-400 border-violet-500/30"
                        }`}
                >
                    {badgeLabel}
                </span>
            </div>

            <p className="mt-1 text-sm font-medium text-blue-400">
                {opportunity.company}
            </p>

            <div className="mt-4 flex flex-col gap-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
                    <span>{opportunity.location}</span>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 shrink-0 text-gray-400" />
                    <span>{opportunity.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-gray-400" />
                    <span>Deadline: {opportunity.deadline}</span>
                </div>
            </div>

            <a
                href={opportunity.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 py-2.5 text-sm font-semibold text-white transition-colors hover:from-blue-700 hover:to-cyan-700"
            >
                Apply Now
            </a>
        </Card>
    )
}
