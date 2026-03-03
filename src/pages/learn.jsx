import { useState } from "react";
import TopNavbar from "../components/topnav";
import AspectGrid from "../components/AspectGrid";
import DomainResults from "../components/DomainResults";
import { getRecommendations } from "../util/recommendationEngine";

export default function Learn() {
    const [selectedAspects, setSelectedAspects] = useState([]);
    const [recommended, setRecommended] = useState([]);

    const handleExplore = () => {
        const results = getRecommendations(selectedAspects);
        setRecommended(results);
    };

    return (
        <>
            <TopNavbar />

            <main className="pt-24  min-h-screen relative overflow-hidden text-white px-10 pb-20 font-orbitron">

                {/* Cosmic Glow */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute top-60 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto relative z-10">
                    <h1 className="text-5xl md:text-6xl font-black leading-[1.3] tracking-tight mb-8 pb-3 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        Discover Your Path in Space Technology
                    </h1>

                    <p className="text-gray-400 text-lg">
                        Select up to 3 interests and explore domains tailored to your strengths.
                    </p>
                </div>

                <div className="relative z-10 mt-16">
                    <AspectGrid
                        selectedAspects={selectedAspects}
                        setSelectedAspects={setSelectedAspects}
                    />
                </div>

                <div className="relative z-10 mt-12 text-center">
                    <button
                        onClick={handleExplore}
                        disabled={selectedAspects.length === 0}
                        className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-all duration-300 disabled:opacity-50"
                    >
                        Explore My Domains
                    </button>
                </div>

                <div className="relative z-10">
                    <DomainResults domains={recommended} />
                </div>

            </main>
        </>

    );
}
// bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text