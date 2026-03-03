import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import ReplySection from "./ReplySection";
import MarkdownContent from "./MarkdownContent";

export default function PostCard({ post, onLike, onReply, onDelete, onEdit }) {
    const { user } = useUser();
    const [showReplies, setShowReplies] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [activeImageIdx, setActiveImageIdx] = useState(null); // Slider state

    const isAuthor = post.user_id === user?.id;
    const username = post.profiles?.username || "Explorer";
    const avatarUrl = post.profiles?.avatar_url;

    const handleSaveEdit = () => {
        onEdit(post.id, editContent);
        setIsEditing(false);
    };

    const timeAgo = (dateStr) => {
        const date = new Date(dateStr);
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return "Just now";
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <div className="group relative bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.05] hover:border-blue-500/50 transition-all duration-700 shadow-2xl overflow-hidden text-left">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-700"></div>

            <div className="flex items-start gap-8">
                {/* User Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-blue-400 overflow-hidden shadow-lg group-hover:border-blue-500 transition-all duration-500 shrink-0">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-xl uppercase">{username[0]}</span>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-6">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight flex items-center gap-3 font-orbitron">
                                {username}
                                {isAuthor && (
                                    <span className="text-[8px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest font-black font-orbitron">Commander</span>
                                )}
                            </h3>
                            {post.domain && (
                                <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em] w-fit shadow-lg shadow-blue-500/10 font-orbitron">
                                    Sector: {post.domain}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-6">
                            {isAuthor && !isEditing && (
                                <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="text-white/30 hover:text-blue-400 transition-colors text-[10px] font-bold uppercase tracking-widest"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(post.id)}
                                        className="text-white/30 hover:text-red-400 transition-colors text-[10px] font-bold uppercase tracking-widest"
                                    >
                                        Expunge
                                    </button>
                                </div>
                            )}
                            <div className="text-right">
                                <span className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] font-orbitron">
                                    {timeAgo(post.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="mb-6 space-y-4">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-white/5 border border-blue-500/30 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition-all font-light"
                                rows="3"
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-105 transition-all"
                                >
                                    Update Signal
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-white/80 leading-relaxed text-lg mb-6 font-light whitespace-pre-wrap font-sans">
                            <MarkdownContent content={post.content} />
                        </div>
                    )}

                    {/* Multi-Image Telemetry Grid */}
                    {post.image_urls && post.image_urls.length > 0 && (
                        <div className={`mb-8 grid gap-4 rounded-3xl overflow-hidden ${post.image_urls.length === 1 ? 'grid-cols-1' :
                            post.image_urls.length === 2 ? 'grid-cols-2' :
                                'grid-cols-2 md:grid-cols-3'
                            }`}>
                            {post.image_urls.map((url, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setActiveImageIdx(idx)}
                                    className="relative group/pic aspect-video border border-white/10 overflow-hidden rounded-2xl cursor-zoom-in"
                                >
                                    <img
                                        src={url}
                                        alt={`Telemetry Stream ${idx + 1}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover/pic:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover/pic:opacity-100 transition-opacity pointer-events-none"></div>
                                    <div className="absolute bottom-2 right-2 p-2 bg-black/60 rounded-lg opacity-0 group-hover/pic:opacity-100 transition-all text-[8px] text-blue-400 font-black uppercase tracking-widest border border-blue-500/30">
                                        Expand Visual
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Fallback for old single image posts */}
                    {!post.image_urls && post.image_url && (
                        <div
                            className="mb-8 rounded-3xl overflow-hidden border border-white/10 shadow-2xl cursor-zoom-in"
                            onClick={() => setActiveImageIdx(-1)} // -1 for legacy single image
                        >
                            <img src={post.image_url} alt="Broadcast Visual" className="w-full object-cover max-h-[500px]" />
                        </div>
                    )}

                    {/* Lightbox Modal with Slider */}
                    {activeImageIdx !== null && (
                        <div
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300 px-4 py-10"
                            onClick={() => setActiveImageIdx(null)}
                        >
                            {/* Close Button */}
                            <button
                                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white hover:bg-red-500 transition-all flex items-center justify-center text-xl z-[110]"
                                onClick={() => setActiveImageIdx(null)}
                            >
                                ✕
                            </button>

                            {/* Image Container */}
                            <div className="relative max-w-5xl w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                <img
                                    src={activeImageIdx === -1 ? post.image_url : post.image_urls[activeImageIdx]}
                                    alt="Expanded Telemetry"
                                    className="max-w-full max-h-full object-contain rounded-2xl shadow-[0_0_100px_rgba(37,99,235,0.2)] border border-white/10 animate-in zoom-in-95 duration-500"
                                />

                                {/* Navigation Arrows */}
                                {activeImageIdx !== -1 && post.image_urls?.length > 1 && (
                                    <>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : post.image_urls.length - 1));
                                            }}
                                            className="absolute left-4 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-blue-600 hover:border-blue-400 transition-all flex items-center justify-center group/nav"
                                        >
                                            <span className="text-2xl group-hover/nav:-translate-x-1 transition-transform">←</span>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveImageIdx((prev) => (prev < post.image_urls.length - 1 ? prev + 1 : 0));
                                            }}
                                            className="absolute right-4 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-blue-600 hover:border-blue-400 transition-all flex items-center justify-center group/nav"
                                        >
                                            <span className="text-2xl group-hover/nav:translate-x-1 transition-transform">→</span>
                                        </button>

                                        {/* Image Counter */}
                                        <div className="absolute top-8 left-8 bg-white/5 border border-white/10 px-6 py-2 rounded-full backdrop-blur-xl">
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                                                Stream {activeImageIdx + 1} of {post.image_urls.length}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.5em] text-blue-400/30">
                                Visual Stream Navigation Protocol Active
                            </div>
                        </div>
                    )}

                    <div className="pt-8 border-t border-white/5 flex items-center gap-10">
                        <button
                            onClick={() => onLike(post.id, post.likes)}
                            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-red-400 transition-all active:scale-95 group/btn font-orbitron"
                        >
                            <span className="bg-white/5 p-2 rounded-lg border border-white/10 group-hover/btn:border-red-500/50 transition-all font-sans">❤️</span>
                            <span className="group-hover/btn:text-white font-orbitron">{post.likes || 0} Endorsements</span>
                        </button>

                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all group/discuss font-orbitron ${showReplies ? 'text-blue-400' : 'text-white/40 hover:text-blue-400'}`}
                        >
                            <span className={`p-2 rounded-lg border transition-all font-sans ${showReplies ? 'bg-blue-500/10 border-blue-500/50' : 'bg-white/5 border-white/10 group-hover/discuss:border-blue-500/50'}`}>💬</span>
                            <span className="font-orbitron">{showReplies ? 'Close Comms' : 'Open Comms'}</span>
                        </button>
                    </div>

                    {showReplies && (
                        <div className="mt-8 animate-in fade-in slide-in-from-top duration-500">
                            <ReplySection post={post} onReply={onReply} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
