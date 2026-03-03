import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function UserMenu({ onLogout }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>

            {/* Avatar */}
            <div
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer hover:scale-105 transition duration-200"
            >
                U
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 mt-3 w-44 bg-[#0b1225]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_30px_rgba(0,120,255,0.15)]">


                    <button
                        onClick={onLogout}
                        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-blue-600/20 transition"
                    >


                        Logout
                    </button>

                </div>
            )
            }
        </div >
    );
}
