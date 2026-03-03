import { useState, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { DOMAINS } from "../pages/talk";

export default function PostInput({ onPost }) {
    const { user } = useUser();
    const [content, setContent] = useState("");
    const [domain, setDomain] = useState("All");
    const [images, setImages] = useState([]); // Array for multi-visual support
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 6) {
            alert("Maximum 6 visual streams allowed per broadcast.");
            return;
        }

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        if (!content.trim() && images.length === 0) return;
        onPost(content, domain, images);
        setContent("");
        setDomain("All");
        setImages([]);
    };

    return (
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_80px_rgba(0,0,0,0.6)] group hover:border-blue-500/40 transition-all duration-700">
            <div className="flex gap-8">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-black text-white shrink-0 shadow-[0_0_30px_rgba(37,99,235,0.3)] border border-white/20 group-hover:rotate-12 transition-transform duration-500 overflow-hidden">
                    {user?.imageUrl ? (
                        <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-sm">AM</span>
                    )}
                </div>

                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Relay your findings to the network..."
                        className="w-full bg-transparent border-none outline-none resize-none text-white placeholder-white/10 text-xl font-light min-h-[120px] py-2 scrollbar-hide text-left font-sans"
                    />

                    {/* Image Preview Area */}
                    {images.length > 0 && (
                        <div className="mt-8 flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom duration-500">
                            {images.map((img, idx) => (
                                <div key={idx} className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border border-white/10 group/img shadow-2xl">
                                    <img src={img} alt="Stream Preview" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-all text-[10px]"
                                    >
                                        ✕
                                    </button>
                                    <span className="absolute bottom-0 left-0 right-0 bg-blue-600/60 text-[8px] font-black p-1 text-center uppercase tracking-widest backdrop-blur-sm font-orbitron">
                                        Stream_{idx + 1}
                                    </span>
                                </div>
                            ))}

                            {images.length < 6 && (
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-white/20 hover:text-blue-400 hover:border-blue-500/30 transition-all gap-2"
                                >
                                    <span className="text-2xl">+</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest">Add Signal</span>
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mt-10 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-6 w-full sm:w-auto">
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-blue-400 transition-all"
                            >
                                <span className="bg-white/5 p-2 rounded-lg border border-white/10 font-sans">📷</span>
                                <span className="hidden sm:inline font-orbitron">Multi-Stream Sync ({images.length}/6)</span>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                                multiple // Enable multiple file selection
                            />

                            <div className="h-4 w-[1px] bg-white/10 hidden sm:block"></div>

                            <div className="flex items-center gap-4 flex-1 sm:flex-none">
                                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest font-orbitron">Sector:</span>
                                <div className="relative flex-1 sm:flex-none">
                                    <select
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                        className="appearance-none bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-blue-400 uppercase tracking-widest outline-none focus:border-blue-500/50 transition-all cursor-pointer min-w-[140px] font-orbitron"
                                    >
                                        <option value="All" className="bg-[#0f0f0f]">Global Relay</option>
                                        {DOMAINS.map(d => (
                                            <option key={d} value={d} className="bg-[#0f0f0f]">{d}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400 text-[10px]">
                                        ⌵
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={!content.trim() && images.length === 0}
                            className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-20 disabled:cursor-not-allowed text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-500 shadow-[0_0_40px_rgba(37,99,235,0.3)] active:scale-95 font-orbitron"
                        >
                            Broadcast Signal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
