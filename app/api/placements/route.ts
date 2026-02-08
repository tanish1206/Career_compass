import { NextResponse } from "next/server"
import type { Opportunity, OpportunityType } from "@/components/placement/types"

// -------------------------------------------------------------------
// JSearch API integration (RapidAPI)
// If RAPIDAPI_KEY is set, we fetch live data; otherwise fall back to
// curated mock data so the UI always works during development.
// -------------------------------------------------------------------

interface JSearchJob {
    job_id: string
    job_title: string
    employer_name: string
    job_city: string
    job_state: string
    job_country: string
    job_min_salary: number | null
    job_max_salary: number | null
    job_salary_currency: string
    job_salary_period: string
    job_employment_type: string
    job_apply_link: string
    job_posted_at_datetime_utc: string
    job_offer_expiration_datetime_utc: string | null
}

function formatSalary(job: JSearchJob): string {
    if (job.job_min_salary && job.job_max_salary) {
        const currency = job.job_salary_currency || "INR"
        const period = job.job_salary_period === "YEAR" ? "LPA" : "/month"
        if (period === "LPA") {
            return `${currency === "INR" ? "₹" : "$"}${Math.round(job.job_min_salary / 100000)}-${Math.round(job.job_max_salary / 100000)} LPA`
        }
        return `${currency === "INR" ? "₹" : "$"}${job.job_min_salary.toLocaleString("en-IN")}${period}`
    }
    return "Competitive"
}

function classifyType(job: JSearchJob): OpportunityType {
    const title = job.job_title.toLowerCase()
    const empType = (job.job_employment_type || "").toLowerCase()
    if (title.includes("intern") || empType.includes("intern")) return "internship"
    return "full-time"
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) {
        const d = new Date()
        d.setMonth(d.getMonth() + 1)
        return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })
    }
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
    })
}

function normalizeJSearchJob(job: JSearchJob, domain: string): Opportunity {
    return {
        id: job.job_id,
        title: job.job_title,
        company: job.employer_name,
        location: [job.job_city, job.job_state, job.job_country].filter(Boolean).join(", ") || "Remote",
        salary: formatSalary(job),
        deadline: formatDate(job.job_offer_expiration_datetime_utc),
        type: classifyType(job),
        applyUrl: job.job_apply_link,
        domain,
        source: "jsearch",
    }
}

// ---- Fallback curated data (matches the UI screenshots exactly) ----

const FALLBACK_DATA: Opportunity[] = [
    {
        id: "1",
        title: "Software Engineering Intern",
        company: "Google",
        location: "Bangalore",
        salary: "₹1,00,000/month",
        deadline: "3/15/2026",
        type: "internship",
        applyUrl: "https://careers.google.com",
        domain: "Software Engineering",
        source: "curated",
    },
    {
        id: "2",
        title: "UI/UX Developer Intern",
        company: "Flipkart",
        location: "Bangalore",
        salary: "₹50,000/month",
        deadline: "3/25/2026",
        type: "internship",
        applyUrl: "https://www.flipkartcareers.com",
        domain: "UI/UX Design",
        source: "curated",
    },
    {
        id: "3",
        title: "React Developer Intern",
        company: "Paytm",
        location: "Noida",
        salary: "₹40,000/month",
        deadline: "3/22/2026",
        type: "internship",
        applyUrl: "https://paytm.com/careers",
        domain: "Frontend",
        source: "curated",
    },
    {
        id: "4",
        title: "Frontend Developer",
        company: "Microsoft",
        location: "Hyderabad",
        salary: "₹18 LPA",
        deadline: "3/20/2026",
        type: "full-time",
        applyUrl: "https://careers.microsoft.com",
        domain: "Frontend",
        source: "curated",
    },
    {
        id: "5",
        title: "SDE-1",
        company: "Amazon",
        location: "Bangalore",
        salary: "₹22 LPA",
        deadline: "3/10/2026",
        type: "full-time",
        applyUrl: "https://www.amazon.jobs",
        domain: "Software Engineering",
        source: "curated",
    },
    {
        id: "6",
        title: "Full Stack Developer",
        company: "Zomato",
        location: "Gurgaon",
        salary: "₹15 LPA",
        deadline: "3/18/2026",
        type: "full-time",
        applyUrl: "https://www.zomato.com/careers",
        domain: "Full Stack",
        source: "curated",
    },
    {
        id: "7",
        title: "Backend Developer Intern",
        company: "Razorpay",
        location: "Bangalore",
        salary: "₹45,000/month",
        deadline: "3/28/2026",
        type: "internship",
        applyUrl: "https://razorpay.com/careers",
        domain: "Backend",
        source: "curated",
    },
    {
        id: "8",
        title: "Data Science Intern",
        company: "Swiggy",
        location: "Bangalore",
        salary: "₹60,000/month",
        deadline: "4/5/2026",
        type: "internship",
        applyUrl: "https://careers.swiggy.com",
        domain: "Data Science",
        source: "curated",
    },
    {
        id: "9",
        title: "DevOps Engineer",
        company: "Infosys",
        location: "Pune",
        salary: "₹12 LPA",
        deadline: "3/30/2026",
        type: "full-time",
        applyUrl: "https://www.infosys.com/careers",
        domain: "DevOps",
        source: "curated",
    },
    {
        id: "10",
        title: "ML Engineer",
        company: "PhonePe",
        location: "Bangalore",
        salary: "₹20 LPA",
        deadline: "4/1/2026",
        type: "full-time",
        applyUrl: "https://www.phonepe.com/careers",
        domain: "Machine Learning",
        source: "curated",
    },
]

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const type = searchParams.get("type") || "all"
    const domain = searchParams.get("domain") || "All Domains"

    const apiKey = process.env.RAPIDAPI_KEY

    let opportunities: Opportunity[] = []

    // --- Try live JSearch API first ---
    if (apiKey) {
        try {
            const searchQuery = [
                query || "software developer",
                domain !== "All Domains" ? domain : "",
                type === "internship" ? "intern" : "",
                "India",
            ]
                .filter(Boolean)
                .join(" ")

            const res = await fetch(
                `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(searchQuery)}&page=1&num_pages=1&date_posted=month`,
                {
                    headers: {
                        "x-rapidapi-key": apiKey,
                        "x-rapidapi-host": "jsearch.p.rapidapi.com",
                    },
                    next: { revalidate: 3600 },
                }
            )

            if (res.ok) {
                const data = await res.json()
                if (data.data && data.data.length > 0) {
                    opportunities = data.data.map((job: JSearchJob) =>
                        normalizeJSearchJob(job, domain !== "All Domains" ? domain : "Software Engineering")
                    )
                }
            }
        } catch (err) {
            console.error("[Placements] JSearch API error, falling back to curated data:", err)
        }
    }

    // --- Fallback to curated data ---
    if (opportunities.length === 0) {
        opportunities = [...FALLBACK_DATA]
    }

    // --- Apply filters ---
    if (query) {
        const q = query.toLowerCase()
        opportunities = opportunities.filter(
            (o) =>
                o.title.toLowerCase().includes(q) ||
                o.company.toLowerCase().includes(q) ||
                o.domain.toLowerCase().includes(q)
        )
    }

    if (type !== "all") {
        opportunities = opportunities.filter((o) => o.type === type)
    }

    if (domain !== "All Domains") {
        opportunities = opportunities.filter((o) => o.domain === domain)
    }

    return NextResponse.json({ results: opportunities, source: apiKey ? "jsearch" : "curated" })
}
