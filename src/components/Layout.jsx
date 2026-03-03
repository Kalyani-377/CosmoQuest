import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="relative min-h-screen overflow-hidden">

            {/* GLOBAL BACKGROUND FOR MAIN APP */}
            <div className="app-background"></div>
            <div className="app-glow"></div>

            {/* PAGE CONTENT */}
            <div className="relative z-10">
                <Outlet />
            </div>

        </div>
    );
}
