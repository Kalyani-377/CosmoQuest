import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import TopNavbar from "../components/topnav";

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getToken } = useAuth();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            const token = await getToken();
            const cachedData = JSON.parse(sessionStorage.getItem("dashboardData") || "{}");
            const lat = cachedData.location?.lat || "";
            const lng = cachedData.location?.lng || "";

            try {
                const res = await fetch(`http://localhost:5000/event-details/${id}?lat=${lat}&lng=${lng}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    setError(errorData.error || "Failed to fetch event details");
                    return;
                }

                const data = await res.json();
                setEvent(data);
            } catch (err) {
                console.error("Fetch error:", err);
                setError("Network error or server unreachable");
            }
        };

        fetchEvent();
    }, [id]);

    if (error) {
        return (
            <div className="min-h-screen bg-black text-white text-center flex flex-col items-center justify-center p-6">
                <p className="text-red-400 text-xl font-orbitron mb-6">{error}</p>
                <button
                    onClick={() => navigate("/")}
                    className="px-8 py-3 bg-blue-600 rounded-full hover:bg-blue-500 transition-all font-orbitron shadow-lg shadow-blue-500/20"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-black text-white text-center flex items-center justify-center font-orbitron">
                <div className="animate-pulse">Locating Cosmic Event...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-orbitron relative overflow-x-hidden">
            <TopNavbar />

            {/* FULL PAGE BACKGROUND */}
            <div className="fixed inset-0 z-0 bg-black flex items-center justify-center">
                <img
                    src={event.image || "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&q=80&w=2000"}
                    alt=""
                    className={`transition-opacity duration-1000 ${event.type === 'constellations'
                        ? 'w-auto h-[90vh] object-contain opacity-100 brightness-125'
                        : 'w-full h-full object-cover opacity-80'
                        }`}
                />
                <div className={`absolute inset-0 ${event.type === 'constellations'
                    ? 'bg-gradient-to-t from-black/60 via-transparent to-transparent'
                    : 'bg-gradient-to-b from-black/80 via-black/40 to-black'
                    }`}></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-16">

                {/* HERO CONTENT */}
                <div className="mb-16">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-8 flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-all group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span> BACK TO COSMOS
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex flex-wrap gap-4 mb-6">
                                <span className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/50 rounded-full text-[10px] font-bold tracking-widest text-blue-300 uppercase">
                                    {event.type || 'MISSION'} SECTOR
                                </span>
                                {event.id?.includes('asteroid') || event.id?.includes('solar') || event.id?.includes('iss') ? (
                                    <span className="px-4 py-1.5 bg-red-500/20 border border-red-500/50 rounded-full text-[10px] font-bold tracking-widest text-red-500 uppercase animate-pulse">
                                        LIVE NASA MISSION
                                    </span>
                                ) : (
                                    <span className="px-4 py-1.5 bg-green-500/20 border border-green-500/50 rounded-full text-[10px] font-bold tracking-widest text-green-300 uppercase">
                                        STATUS: ACTIVE
                                    </span>
                                )}
                            </div>
                            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none mb-4">
                                {event.name}
                            </h1>
                            <p className="text-blue-400 text-lg tracking-[0.3em] font-light">
                                TARGET IDENTIFIED FROM YOUR COORDINATES
                            </p>
                            {event.date && (
                                <div className="mt-8 inline-block px-6 py-2 bg-white/10 border border-white/20 rounded-xl">
                                    <span className="text-white text-2xl font-black tracking-widest">{event.date}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {/* LEFT CONTENT */}
                    <div className="md:col-span-2 space-y-16">
                        <section className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
                            <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b border-white/10 pb-2 flex items-center gap-3">
                                <span>📡</span> Mission Intelligence
                            </h2>
                            <p className="text-white/80 text-xl leading-relaxed">
                                {event.description}
                            </p>
                        </section>

                        <section className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
                            <h2 className="text-2xl font-bold mb-6 text-green-400 border-b border-white/10 pb-2 flex items-center gap-3">
                                <span>🔭</span> Observation Protocols
                            </h2>
                            <ul className="space-y-6">
                                {event.tips?.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-5 text-white/80 group">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center shrink-0 mt-1 group-hover:bg-green-500 group-hover:text-black transition-all">
                                            {i + 1}
                                        </div>
                                        <span className="text-lg">{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
                            <h2 className="text-2xl font-bold mb-6 text-purple-400 border-b border-white/10 pb-2 flex items-center gap-3">
                                <span>📍</span> Optimal Intercept Points
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                {event.dark_spots?.map((spot, i) => (
                                    <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-blue-500/10 hover:border-blue-500/50 transition-all group cursor-default">
                                        <h4 className="font-bold text-xl text-white group-hover:text-blue-300 mb-2">{spot.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <p className="text-sm text-white/50 uppercase tracking-widest">{spot.level}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="space-y-8">
                        <div className="p-8 bg-blue-500/10 backdrop-blur-xl border border-blue-500/30 rounded-[2.5rem] sticky top-32">
                            <h3 className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-8 flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                                Real-Time Telemetry
                            </h3>

                            <div className="space-y-10">
                                <div>
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] block mb-2 font-bold">Visibility Grade</label>
                                    <span className="text-3xl font-black text-white">{event.visibility}</span>
                                </div>
                                <div>
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] block mb-2 font-bold">Atmospheric Condition</label>
                                    <span className="text-3xl font-black text-white">{event.weather?.condition || "Scanning..."}</span>
                                </div>
                                {event.weather?.cloud_cover !== undefined && (
                                    <div>
                                        <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] block mb-2 font-bold">Local Cloud Cover</label>
                                        <span className="text-3xl font-black text-blue-400">{event.weather.cloud_cover}%</span>
                                    </div>
                                )}
                                <div>
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] block mb-2 font-bold">Peak Viewing Window</label>
                                    <span className="text-3xl font-black text-white">{event.peak || "Optimal at Midnight"}</span>
                                </div>
                                <div>
                                    <label className="text-[10px] text-white/30 uppercase tracking-[0.2em] block mb-2 font-bold">Recommended Gear</label>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-sm font-bold text-blue-200">70mm Refractor + Viewfinder</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-white/10">
                                <p className="text-[10px] text-white/20 uppercase leading-relaxed tracking-wider">
                                    Observation data is synced with real-time orbital mechanics for your specific location.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}