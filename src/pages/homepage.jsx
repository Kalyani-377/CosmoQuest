import TopNavbar from "../components/topnav";
import spaceVideo from "../assets/space.mp4";
import "./homepage.css";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { DashboardHeroSkeleton, EventCardSkeleton } from "../components/Skeleton";

export default function Home() {
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [dashboardData, setDashboardData] = useState(() => {
        const cached = sessionStorage.getItem("dashboardData");
        return cached ? JSON.parse(cached) : null;
    });
    const [loading, setLoading] = useState(!dashboardData);
    const [filter, setFilter] = useState("all");

    const fetchDashboard = useCallback(async (lat, lng) => {
        const todayStr = new Date().toISOString().split('T')[0];
        try {
            const token = await getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            const res = await fetch("http://127.0.0.1:5000/dashboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ lat, lng }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            data.cachedDate = todayStr;
            data.lastFetched = Date.now();

            sessionStorage.setItem("dashboardData", JSON.stringify(data));
            setDashboardData(data);
            setLoading(false);
        } catch (err) {
            console.error("Dashboard fetch error:", err);
            setLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        const checkAndFetch = () => {
            const today = new Date().toISOString().split('T')[0];
            const now = Date.now();

            const hasCuratedEvents = dashboardData?.events?.some(e => ['iss', 'planets', 'meteors', 'constellations'].includes(e.type));
            const isDataFresh = dashboardData?.cachedDate === today;
            const isRecentlyFetched = dashboardData?.lastFetched && (now - dashboardData.lastFetched < 6 * 60 * 60 * 1000);

            if (dashboardData && dashboardData.apod?.image && hasCuratedEvents && isDataFresh && isRecentlyFetched) {
                setLoading(false);
                return;
            }

            // Start pre-fetching with global default immediately
            if (!dashboardData) {
                fetchDashboard(0, 0);
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // Refetch only if coordinates changed significantly from previous or default (0,0)
                    if (!dashboardData ||
                        Math.abs(dashboardData.location?.lat - latitude) > 0.5 ||
                        Math.abs(dashboardData.location?.lng - longitude) > 0.5) {
                        fetchDashboard(latitude, longitude);
                    }
                },
                () => {
                    if (!dashboardData) fetchDashboard(0, 0);
                },
                { timeout: 5000 }
            );
        };

        checkAndFetch();
        const interval = setInterval(checkAndFetch, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchDashboard, dashboardData?.cachedDate, dashboardData?.lastFetched, dashboardData]);

    const filteredEvents =
        filter === "all"
            ? dashboardData?.events || []
            : dashboardData?.events?.filter(
                (event) => event.type?.toLowerCase().includes(filter.toLowerCase())
            ) || [];

    return (
        <div className="text-white font-orbitron min-h-screen bg-black">
            <TopNavbar />

            {loading ? (
                <DashboardHeroSkeleton />
            ) : (
                <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 z-10 pt-20">
                    {dashboardData?.apod && dashboardData.apod.media_type === "image" ? (
                        <img
                            src={dashboardData.apod.image || "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=2000"}
                            alt="Hero APOD"
                            className="absolute inset-0 w-full h-full object-cover -z-10 opacity-50"
                            onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=2000";
                            }}
                        />
                    ) : (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover -z-10 opacity-40"
                        >
                            <source src={spaceVideo} type="video/mp4" />
                        </video>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black -z-10"></div>

                    <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
                        <h1 className="text-6xl font-bold mb-6 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-200 to-white/50">
                            Explore the Universe
                        </h1>

                        {dashboardData?.apod && (
                            <div className="mb-12 group cursor-pointer max-w-lg" onClick={() => navigate('/apod')}>
                                <div className="relative overflow-hidden rounded-2xl border border-white/20 shadow-[0_0_50px_rgba(0,100,255,0.2)] group-hover:border-blue-500/50 transition-all duration-500">
                                    <img
                                        src={dashboardData.apod.image || "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=2000"}
                                        alt={dashboardData.apod.title}
                                        className="w-full h-[300px] object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.src = "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=2000";
                                        }}
                                    />

                                    {/* Video Overlay */}
                                    {dashboardData.apod.media_type === "video" && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all">
                                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500">
                                                <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1.5"></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4 text-left">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-blue-400 text-[10px] uppercase tracking-[0.3em] font-bold">
                                                {dashboardData.apod.media_type === "video" ? "Today's Cosmic Video" : "Today's Cosmic Discovery"}
                                            </p>
                                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                            <span className="text-[8px] text-green-400 font-bold uppercase tracking-widest">Live Sync</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors line-clamp-1">
                                            {dashboardData.apod.title}
                                        </h3>
                                        <p className="text-white/40 text-[9px] uppercase tracking-widest mt-1">
                                            {dashboardData.apod.date || new Date().toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <p className="text-white/70 mb-10 text-lg max-w-2xl leading-relaxed">
                            Your portal to the stars. Real-time natural events tracked by NASA and local astronomical sightings.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mb-10">
                            <CategoryCard label="🌌 All" active={filter === "all"} onClick={() => setFilter("all")} />
                            <CategoryCard label="🛰 ISS" active={filter === "iss"} onClick={() => setFilter("iss")} />
                            <CategoryCard label="🪐 Planets" active={filter === "planets"} onClick={() => setFilter("planets")} />
                            <CategoryCard label="☄ Meteors" active={filter === "meteors"} onClick={() => setFilter("meteors")} />
                            <CategoryCard label="🌑 Eclipses" active={filter === "eclipses"} onClick={() => setFilter("eclipses")} />
                            <CategoryCard label="✨ Constellations" active={filter === "constellations"} onClick={() => setFilter("constellations")} />
                        </div>
                    </div>
                </section>
            )}

            <section className="px-6 py-10 max-w-5xl mx-auto">
                <div className="flex flex-col items-center mb-12">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.4em]">Sector Analysis</span>
                    </div>
                    <h2 className="text-4xl font-bold text-center tracking-tight mb-2">Daily Cosmic Briefing</h2>
                    {loading ? (
                        <div className="w-48 h-4 animate-pulse bg-white/10 rounded"></div>
                    ) : (
                        <p className="text-white/40 text-sm">
                            Local coordinates: <span className="text-white/70">{dashboardData?.location?.sector || "Global Sector"}</span>
                            <span className="mx-2">|</span>
                            Last Scan: <span className="text-white/70">{new Date(dashboardData?.lastFetched || Date.now()).toLocaleTimeString()}</span>
                        </p>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {loading ? (
                        [1, 2, 3, 4].map(i => <EventCardSkeleton key={i} />)
                    ) : filteredEvents.length === 0 ? (
                        <p className="text-center text-white/40 italic py-10 col-span-2">No events found in this category.</p>
                    ) : (
                        filteredEvents.map((event) => (
                            <div
                                key={event.id}
                                onClick={() => navigate(`/events/${event.id}`)}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:bg-white/10 transition-all hover:-translate-y-1"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-semibold">{event.event_type || event.name}</h3>
                                    <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm font-black tracking-widest text-white shadow-lg whitespace-nowrap">
                                        {event.date}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-white/60 text-sm">Visibility:</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${event.visibility?.toLowerCase().includes('high') ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                                        event.visibility?.toLowerCase().includes('medium') ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                                            'bg-red-500/20 text-red-400 border border-red-500/50'
                                        }`}>
                                        {event.visibility}
                                    </span>
                                </div>
                                <p className="text-white/40 text-sm line-clamp-2">{event.description}</p>
                                <div className="mt-4 text-blue-400 text-xs font-bold tracking-widest">VIEW DETAILS →</div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

function CategoryCard({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-2 rounded-full border text-sm transition-all ${active
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-white/5 border-white/10 text-white/60 hover:border-white/30"
                }`}
        >
            {label}
        </button>
    );
}
