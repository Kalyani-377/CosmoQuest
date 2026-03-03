import { useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/clerk-react";
import TopNavbar from "../components/topnav";
import { EventCardSkeleton } from "../components/Skeleton";

export default function EventsPage() {
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [events, setEvents] = useState(() => {
        const cached = sessionStorage.getItem("cosmicEvents");
        return cached ? JSON.parse(cached) : [];
    });
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(events.length === 0);

    const fetchEvents = useCallback(async (lat = null, lng = null) => {
        try {
            const token = await getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            let url = "http://127.0.0.1:5000/events";
            if (lat && lng) url += `?lat=${lat}&lng=${lng}`;

            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            const fetchedEvents = data.events || [];

            setEvents(fetchedEvents);
            sessionStorage.setItem("cosmicEvents", JSON.stringify(fetchedEvents));
            setLoading(false);
        } catch (err) {
            console.error("Error fetching events:", err);
            setLoading(false);
        }
    }, [getToken]);

    useEffect(() => {
        const syncEvents = () => {
            if (events.length === 0) {
                // Initial fetch with defaults
                fetchEvents();
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => fetchEvents(pos.coords.latitude, pos.coords.longitude),
                () => fetchEvents(),
                { timeout: 5000 }
            );
        };

        syncEvents();

        // Check for cosmic updates every hour
        const interval = setInterval(syncEvents, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [fetchEvents, events.length]);

    // 🔎 SEARCH + FILTER LOGIC
    const filteredEvents = events.filter((event) => {
        const searchLower = search.toLowerCase().trim();

        // If search is empty, show everything (subject to filter)
        if (!searchLower) {
            const matchesFilter = filter === "all" ||
                event.type?.toLowerCase().includes(filter.toLowerCase()) ||
                event.event_type?.toLowerCase().includes(filter.toLowerCase());
            return matchesFilter;
        }

        const matchesSearch =
            event.event_type?.toLowerCase().includes(searchLower) ||
            event.name?.toLowerCase().includes(searchLower) ||
            event.location?.toLowerCase().includes(searchLower) ||
            event.type?.toLowerCase().includes(searchLower);

        const matchesFilter =
            filter === "all" ||
            event.type?.toLowerCase().includes(filter.toLowerCase()) ||
            event.event_type?.toLowerCase().includes(filter.toLowerCase());

        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-black text-white font-orbitron">
            <TopNavbar />

            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                    Universal Events
                </h1>
                <p className="text-white/40 mb-12 max-w-2xl mx-auto text-lg">
                    Browse astronomical phenomena across the globe. Search by name, description, or region.
                </p>

                {/* SEARCH SECTION */}
                <div className="relative max-w-2xl mx-auto mb-16">
                    <input
                        type="text"
                        placeholder="Search for space events (by Name or Place)..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 outline-none focus:border-blue-500/50 transition-all text-lg shadow-2xl"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-white/20">
                        🔍
                    </div>
                    {search && (
                        <div className="absolute -bottom-8 left-0 text-white/40 text-sm italic">
                            Showing {filteredEvents.length} cosmic {filteredEvents.length === 1 ? 'event' : 'events'} for "{search}"
                        </div>
                    )}
                </div>

                {/* FILTER CATEGORIES */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    <FilterButton label="All" active={filter === "all"} onClick={() => setFilter("all")} />
                    <FilterButton label="ISS" active={filter === "iss"} onClick={() => setFilter("iss")} />
                    <FilterButton label="Planets" active={filter === "planet"} onClick={() => setFilter("planet")} />
                    <FilterButton label="Meteors" active={filter === "meteor"} onClick={() => setFilter("meteor")} />
                    <FilterButton label="Eclipses" active={filter === "eclipse"} onClick={() => setFilter("eclipse")} />
                    <FilterButton label="Constellations" active={filter === "constellation"} onClick={() => setFilter("constellation")} />
                </div>

                {/* EVENTS GRID */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map(i => <EventCardSkeleton key={i} />)
                    ) : filteredEvents.length === 0 ? (
                        <div className="col-span-full py-20 text-white/30 text-xl border border-dashed border-white/10 rounded-3xl">
                            No cosmic events match your criteria.
                        </div>
                    ) : (
                        filteredEvents.map((event) => (
                            <div
                                key={event.id}
                                onClick={() => navigate(`/events/${event.id}`)}
                                className="group relative bg-white/5 border border-white/10 rounded-3xl p-8 text-left cursor-pointer hover:bg-white/10 hover:-translate-y-2 transition-all duration-500 shadow-xl overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500"></div>

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col gap-2">
                                        <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-[10px] font-bold tracking-widest text-blue-400 uppercase w-fit">
                                            {event.type || 'Cosmic'}
                                        </span>
                                        {event.source === "NASA LIVE" && (
                                            <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full text-[8px] font-bold tracking-[0.2em] text-red-500 uppercase animate-pulse w-fit">
                                                LIVE NASA DATA
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-md text-sm font-black text-white tracking-widest shadow-md">
                                            {event.date}
                                        </span>
                                        <span className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-2">
                                            {event.location || "Global"}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                                    {event.event_type || event.name}
                                </h3>

                                <div className="flex items-center gap-2 mb-6">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${event.visibility?.toLowerCase().includes('high') ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                                        event.visibility?.toLowerCase().includes('medium') ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                                            'bg-red-500/20 text-red-400 border border-red-500/50'
                                        }`}>
                                        Visibility: {event.visibility}
                                    </span>
                                </div>

                                <p className="text-white/60 text-sm leading-relaxed mb-8 line-clamp-3">
                                    {event.description}
                                </p>

                                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold tracking-widest group-hover:gap-4 transition-all">
                                    VIEW MISSION DETAILS <span>→</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function FilterButton({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`px-8 py-2.5 rounded-full border text-sm font-bold tracking-wide transition-all duration-300 ${active
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30 scale-105"
                : "bg-white/5 border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                }`}
        >
            {label}
        </button>
    );
}
