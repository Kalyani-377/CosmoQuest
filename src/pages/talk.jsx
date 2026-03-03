import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../util/supabase";
import TopNavbar from "../components/topnav";
import PostInput from "../components/PostInput";
import PostList from "../components/PostList";

export const DOMAINS = ["Astrophysics", "Rocket Engineering", "Space Observation", "Exoplanets", "Astrobiology"];

export default function Talk() {
    const { user, isSignedIn } = useUser();
    const [posts, setPosts] = useState([]);
    const [filter, setFilter] = useState("All");
    const [viewMode, setViewMode] = useState("all");

    useEffect(() => {
        if (isSignedIn && user) {
            syncUser();
        }
    }, [isSignedIn, user]);

    useEffect(() => {
        fetchPosts();

        const channel = supabase
            .channel('public:posts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, () => {
                fetchPosts();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const syncUser = async () => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code === 'PGRST116') {
            await supabase.from('profiles').insert([
                {
                    id: user.id,
                    username: user.username || user.firstName || 'Explorer',
                    avatar_url: user.imageUrl
                }
            ]);
        }
    };

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                profiles (
                    username,
                    avatar_url
                )
            `)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setPosts(data);
        }
    };

    const handleCreatePost = async (content, domain, imageDataArray) => {
        if (!user) return;

        const uploadedUrls = [];

        if (imageDataArray && imageDataArray.length > 0) {
            const uploadPromises = imageDataArray.map(async (image, index) => {
                const file = dataURLtoFile(image, `post-${Date.now()}-${index}.png`);
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('post-images')
                    .upload(`${user.id}/${file.name}`, file);

                if (uploadData) {
                    const { data: urlData } = supabase.storage
                        .from('post-images')
                        .getPublicUrl(uploadData.path);
                    return urlData.publicUrl;
                }
                return null;
            });

            const results = await Promise.all(uploadPromises);
            results.forEach(url => { if (url) uploadedUrls.push(url); });
        }

        const { error } = await supabase
            .from('posts')
            .insert([
                {
                    user_id: user.id,
                    content,
                    domain: domain === "All" ? "General" : domain,
                    image_urls: uploadedUrls // Updated to save the array
                }
            ]);

        if (error) console.error("Broadcast Error:", error);
        // Realtime handles refresh
    };

    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    const handleLike = async (id, currentLikes) => {
        const { error } = await supabase
            .from('posts')
            .update({ likes: (currentLikes || 0) + 1 })
            .eq('id', id);

        if (error) console.error("Endorsement Error:", error);
    };

    const handleReply = async (postId, replyText) => {
        if (!user || !replyText.trim()) return;

        const { error } = await supabase
            .from('comments')
            .insert([
                {
                    post_id: postId,
                    user_id: user.id,
                    content: replyText
                }
            ]);

        if (error) console.error("Comms Error:", error);
    };

    const handleDeletePost = async (postId) => {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) console.error("Deletion Error:", error);
    };

    const handleEditPost = async (postId, newContent) => {
        const { error } = await supabase
            .from('posts')
            .update({ content: newContent })
            .eq('id', postId);

        if (error) console.error("Edit Error:", error);
    };

    const filteredPosts = posts.filter(post => {
        const matchesDomain = filter === "All" || post.domain === filter;
        const matchesViewMode = viewMode === "all" || post.user_id === user?.id;
        return matchesDomain && matchesViewMode;
    });

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
            <TopNavbar />

            <div className="max-w-5xl mx-auto px-6 pt-32 pb-20">
                <div className="text-center mb-20 animate-in fade-in slide-in-from-top duration-700">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 uppercase font-orbitron">
                        Galactic Forum
                    </h1>
                    <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
                        The central communication hub for all space explorers. Share research, coordinates, and stellar discoveries.
                    </p>
                </div>

                <div className="mb-20">
                    <PostInput onPost={handleCreatePost} />
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12 pb-8 border-b border-white/10">
                    <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                        <button
                            onClick={() => setViewMode("all")}
                            className={`px-8 py-3 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 font-orbitron ${viewMode === "all"
                                ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105"
                                : "text-white/40 hover:text-white/70"
                                }`}
                        >
                            Universal Feed
                        </button>
                        <button
                            onClick={() => setViewMode("my")}
                            className={`px-8 py-3 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 font-orbitron ${viewMode === "my"
                                ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105"
                                : "text-white/40 hover:text-white/70"
                                }`}
                        >
                            My Relays
                        </button>
                    </div>

                    <div className="flex items-center gap-4 group">
                        <span className="text-[10px] text-white/30 font-bold uppercase tracking-[0.3em]">Sector Filter:</span>
                        <div className="relative">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="appearance-none bg-white/5 border border-white/10 rounded-2xl px-6 py-3 text-[10px] font-bold tracking-widest uppercase outline-none focus:border-blue-500/50 hover:bg-white/10 transition-all cursor-pointer min-w-[200px] font-orbitron"
                            >
                                <option value="All" className="bg-[#0f0f0f]">All Sectors</option>
                                {DOMAINS.map(d => (
                                    <option key={d} value={d} className="bg-[#0f0f0f]">{d}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/30 text-xs text-blue-400">
                                ⌵
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Feed */}
                    <div className="lg:col-span-8">
                        <PostList
                            posts={filteredPosts}
                            onLike={handleLike}
                            onReply={handleReply}
                            onDelete={handleDeletePost}
                            onEdit={handleEditPost}
                        />
                    </div>

                    {/* Right Column: Trending Sectors */}
                    <div className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-32">
                        <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 font-orbitron">Active Sectors</h3>
                            </div>

                            <div className="space-y-6">
                                {DOMAINS.map(d => {
                                    const count = posts.filter(p => p.domain === d).length;
                                    return (
                                        <div key={d} className="group cursor-pointer" onClick={() => setFilter(d)}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`text-xs font-bold transition-colors ${filter === d ? 'text-blue-400 font-orbitron' : 'text-white/40 group-hover:text-white font-sans'}`}>
                                                    {d}
                                                </span>
                                                <span className="text-[10px] font-mono text-white/20">{count} RELAYS</span>
                                            </div>
                                            <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full bg-blue-500 transition-all duration-700 ${filter === d ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-1/4 group-hover:opacity-50'}`}
                                                    style={{ width: filter === d ? '100%' : '0%' }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <button
                                    onClick={() => setFilter("All")}
                                    className="w-full pt-4 mt-4 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-blue-400/50 hover:text-blue-400 transition-colors text-center font-orbitron"
                                >
                                    View All Sectors
                                </button>
                            </div>
                        </div>

                        {/* Network Status Card */}
                        <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-6 text-center font-orbitron">Relay Health</h4>
                            <div className="flex justify-around items-center">
                                <div className="text-center">
                                    <div className="text-xl font-bold text-white mb-1 font-orbitron">{posts.length}</div>
                                    <div className="text-[8px] text-white/20 font-black uppercase tracking-widest font-orbitron">Total Signals</div>
                                </div>
                                <div className="w-[1px] h-8 bg-white/10"></div>
                                <div className="text-center">
                                    <div className="text-xl font-bold text-blue-400 mb-1 font-orbitron">
                                        {posts.reduce((acc, p) => acc + (p.likes || 0), 0)}
                                    </div>
                                    <div className="text-[8px] text-white/20 font-black uppercase tracking-widest font-orbitron">Endorsed</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
