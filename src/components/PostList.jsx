import PostCard from "./PostCard";

export default function PostList({ posts, onLike, onReply, onDelete, onEdit }) {
    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02]">
                <div className="text-7xl mb-10 animate-bounce opacity-20">🛸</div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tighter uppercase">Sector Silence Detected</h3>
                <p className="text-white/30 max-w-md mx-auto text-sm leading-relaxed tracking-widest font-light">
                    COORDINATES SCANNING... NO ACTIVE RELAYS FOUND IN THIS QUADRANT. INITIATE BROADCAST TO ESTABLISH CONTACT.
                </p>
                <div className="mt-10 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onLike={onLike}
                    onReply={onReply}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}
