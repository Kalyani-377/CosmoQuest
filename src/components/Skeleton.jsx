import React from "react";

export function Skeleton({ className }) {
    return (
        <div className={`animate-pulse bg-white/10 rounded ${className}`}></div>
    );
}

export function EventCardSkeleton() {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[200px] flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-1/4" />
            </div>
            <Skeleton className="h-4 w-1/3" />
            <div className="flex flex-col gap-2 mt-auto">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
            </div>
            <Skeleton className="h-4 w-1/4 mt-2" />
        </div>
    );
}

export function DashboardHeroSkeleton() {
    return (
        <div className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 z-10 pt-20">
            <div className="max-w-4xl w-full flex flex-col items-center text-center">
                <Skeleton className="h-16 w-3/4 mb-6" />

                <div className="mb-12 w-full max-w-lg">
                    <div className="relative overflow-hidden rounded-2xl border border-white/20 aspect-video">
                        <Skeleton className="w-full h-full" />
                    </div>
                </div>

                <Skeleton className="h-6 w-2/3 mb-10" />

                <div className="flex flex-wrap justify-center gap-4 mb-10">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <Skeleton key={i} className="h-10 w-24 rounded-full" />
                    ))}
                </div>
            </div>
        </div>
    );
}
