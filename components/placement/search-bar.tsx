"use client"

import { Search } from "lucide-react"
import { DOMAINS } from "./types"
import type { PlacementFilters } from "./types"

interface SearchBarProps {
    filters: PlacementFilters
    onFiltersChange: (filters: PlacementFilters) => void
    isLoading: boolean
}

export function SearchBar({ filters, onFiltersChange, isLoading }: SearchBarProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by role, company, or skill..."
                    value={filters.query}
                    onChange={(e) =>
                        onFiltersChange({ ...filters, query: e.target.value })
                    }
                    className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--card)] pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            <select
                value={filters.type}
                onChange={(e) =>
                    onFiltersChange({
                        ...filters,
                        type: e.target.value as PlacementFilters["type"],
                    })
                }
                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                <option value="all">All Types</option>
                <option value="internship">Internships</option>
                <option value="full-time">Full-Time</option>
            </select>

            <select
                value={filters.domain}
                onChange={(e) =>
                    onFiltersChange({ ...filters, domain: e.target.value })
                }
                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                {DOMAINS.map((domain) => (
                    <option key={domain} value={domain}>
                        {domain}
                    </option>
                ))}
            </select>

            {isLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    Loading...
                </div>
            )}
        </div>
    )
}
