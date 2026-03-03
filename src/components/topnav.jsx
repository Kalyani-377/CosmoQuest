import { useNavigate, useLocation } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import UserMenu from "./usermenu";

export default function TopNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { signOut } = useClerk();

    const handleLogout = () => {
        sessionStorage.removeItem("dashboardData");
        signOut({ redirectUrl: "/login" });
    };

    const navItems = [
        { label: "Home", path: "/homepage" },
        { label: "Events", path: "/events" },
        { label: "Learn", path: "/learn" },
        { label: "Talk", path: "/talk" },
    ];

    return (
        <nav className="sticky top-0 left-0 w-full px-8 py-3 backdrop-blur-xl border-b border-white/10 flex items-center font-orbitron z-[100]">

            {/* 🌌 Left: Logo */}
            <div
                onClick={() => navigate("/homepage")}
                className="flex items-center gap-2 cursor-pointer"
            >
                <span className="text-2xl">🌌</span>
                <h1 className="text-xl font-extrabold tracking-wide text-white">
                    COSMO<span className="text-blue-400">QUEST</span>
                </h1>
            </div>

            {/* Center Navigation */}
            <div className="flex items-center gap-10 ml-auto">
                {navItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`text-sm md:text-base tracking-wide transition ${location.pathname === item.path
                            ? "text-blue-400"
                            : "text-gray-300 hover:text-white"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {/* Right: Logout */}
            <div className="ml-7 z-10">
                <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-red-400 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}