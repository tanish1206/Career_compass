export type OpportunityType = "internship" | "full-time"

export interface Opportunity {
    id: string
    title: string
    company: string
    location: string
    salary: string
    deadline: string
    type: OpportunityType
    applyUrl: string
    domain: string
    source: string
}

export interface PlacementFilters {
    query: string
    type: OpportunityType | "all"
    domain: string
}

export const DOMAINS = [
    "All Domains",
    "Software Engineering",
    "Frontend",
    "Backend",
    "Full Stack",
    "UI/UX Design",
    "Data Science",
    "DevOps",
    "Mobile Development",
    "Machine Learning",
    "Cybersecurity",
] as const

export const APPLICATION_TIPS = [
    "Tailor your resume for each application",
    "Prepare for technical interviews by practicing DSA problems",
    "Research the company and role before applying",
    "Build a strong portfolio with real-world projects",
    "Network with professionals on LinkedIn and at events",
    "Follow up after submitting your application",
]
