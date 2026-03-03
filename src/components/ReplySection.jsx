import { useState, useEffect } from "react";
import { supabase } from "../util/supabase";

export default function ReplySection({ post, onReply }) {
    const [replyText, setReplyText] = useState("");
    const [replies, setReplies] = useState([]);

    useEffect(() => {
        fetchReplies();

        const channel = supabase
            .channel(`public:comments:post_id=eq.${post.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${post.id}` }, () => {
                fetchReplies();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [post.id]);

    const fetchReplies = async () => {
        const { data, error } = await supabase
            .from('comments')
            .select(`
                *,
                profiles (
                    username,
                    avatar_url
                )
            `)
            .eq('post_id', post.id)
            .order('created_at', { ascending: true });

        if (!error && data) {
            setReplies(data);
        }
    };

    const handleSubmit = (e) => {
        if (e.key === "Enter" || e.type === "click") {
            if (!replyText.trim()) return;
            onReply(post.id, replyText);
            setReplyText("");
        }
    };

    return (
        <div className="space-y-6 pt-6 border-t border-white/5">
            {/* Reply Input */}
            <div className="flex gap-4 items-center bg-white/5 p-2 rounded-2xl border border-white/10 focus-within:border-blue-500/50 transition-all">
                <input
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={handleSubmit}
                    placeholder="Establish secure frequency for reply..."
                    className="bg-transparent border-none outline-none text-sm text-white placeholder-white/10 flex-1 px-4 py-2 font-light"
                />
                <button
                    onClick={handleSubmit}
                    disabled={!replyText.trim()}
                    className="p-2 text-blue-400 hover:text-blue-300 disabled:opacity-20 transition-all"
                >
                    🚀
                </button>
            </div>

            {/* Replies List */}
            {replies.length > 0 && (
                <div className="space-y-4 pl-12 relative">
                    <div className="absolute left-6 top-0 bottom-4 w-[1px] bg-gradient-to-b from-blue-500/50 to-transparent"></div>

                    {replies.map((reply) => (
                        <div key={reply.id} className="relative group/reply animate-in fade-in slide-in-from-left duration-300 text-left">
                            <div className="absolute -left-6 top-4 w-4 h-[1px] bg-blue-500/50"></div>

                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 group-hover/reply:border-blue-500/30 transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    {reply.profiles?.avatar_url && (
                                        <img src={reply.profiles.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover border border-white/10" />
                                    )}
                                    <span className="text-[10px] font-black text-blue-400/70 uppercase tracking-widest">
                                        @{reply.profiles?.username || "Explorer"}
                                    </span>
                                </div>
                                <p className="text-white/60 text-sm font-light leading-relaxed">
                                    {reply.content}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
