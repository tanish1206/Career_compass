import { APPLICATION_TIPS } from "./types"

export function ApplicationTips() {
    return (
        <section className="mt-12 rounded-lg border border-amber-500/30 bg-amber-950/20 p-6">
            <div className="mb-4 flex items-center gap-2">
                <span className="text-xl" role="img" aria-label="pin">
                    {"📌"}
                </span>
                <h2 className="text-lg font-bold text-white">Application Tips</h2>
            </div>
            <ul className="flex flex-col gap-2.5">
                {APPLICATION_TIPS.map((tip) => (
                    <li
                        key={tip}
                        className="flex items-start gap-2 text-sm text-gray-300"
                    >
                        <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-gray-400" />
                        {tip}
                    </li>
                ))}
            </ul>
        </section>
    )
}
