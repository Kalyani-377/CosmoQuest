import "./loadingPage.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Loading() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/homepage"); // main page route
        }, 7000); // 7seconds

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center  text-white overflow-hidden">

            {/* Glow background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1b003a,black)] opacity-80"></div>

            {/* Planet */}
            <div className="relative w-28 h-28 rounded-full loading-planet">
                <div className="absolute inset-0 rounded-full loading-planet">
                    <div className="loading-ring"></div>
                </div>

            </div>


            {/* Text */}
            <p className="mt-16  text-lg tracking-widest  z-10 font-orbitron">
                Initializing Mission...
            </p>

            {/* Loading dots */}
            <div className="flex mt-10 space-x-1 z-10">
                <span className="w-2 h-2 bg-white rounded-full animate-ping  "></span>
                <span className="w-2 h-2 bg-white rounded-full animate-ping delay-5000"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-ping delay-10000"></span>
            </div>
        </div>
    );
}
