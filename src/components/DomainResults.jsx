// import React from "react";
import DomainCard from "./DomainCard";

export default function DomainResults({ domains }) {
    if (domains.length === 0) return null;

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-6">
                Recommended Domains
            </h2>

            <div className="grid md:grid-cols-2 gap-6 pb-20">
                {domains.map((domain, index) => (
                    <DomainCard key={index} domain={domain} />
                ))}
            </div>
        </div>
    );
}
