import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./OpeningPage.css";

export default function OpeningPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Pre-load common astronomical images or data hints
        // This makes the transition to homepage smoother
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = 'http://127.0.0.1:5000/dashboard';
        document.head.appendChild(link);
    }, []);

    const goToLogin = () => {
        navigate("/login");
    };

    return (
        <>
            <div className="splashscreen">
                {/* TWINKLE STARS BEHIND TEXT */}
                <div className="twinkle-stars"></div>

                {/* PROJECT TITLE */}
                <h1
                    key={Date.now()}
                    className="project-title absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] ml-[2%]">
                    COSMOQUEST
                </h1>

                {/* SUBTITLE */}
                <p
                    key={Date.now() + 1}
                    className="project-subtitle absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10%] ml-[2%]">
                    Explore the sky, Discover your future!
                </p>
                {/* START BUTTON */}
                <a
                    key={Date.now() + 2}
                    onClick={goToLogin}
                    className="start-btn absolute top-[75%] left-[40%] -translate-x-1/2 float z-[9999] ml-[2%]"
                >
                    Start Exploring →
                </a>

                {/* MAIN SPACE BACKGROUND */}
                <div className="relative w-full h-screen bg-black overflow-hidden">



                    <div className="relative w-full h-screen bg-black overflow-hidden">


                        {/* BACKGROUND STARFIELD */}
                        <div className="stars parallax"></div>
                        <div className="stars2 parallax"></div>
                        <div className="stars3 parallax"></div>

                        {/* FLOATING DUST */}
                        <div className="space-dust parallax"></div>

                        <div className="galaxy-swirl parallax"></div>

                        {/* SLOW NEBULA */}
                        <div className="nebula parallax"></div>
                        <div className="space-grain parallax"></div>


                        {/* SUN */}
                        <div className="absolute top-24 right-16 planet-sun spin-slow"></div>

                        {/* MERCURY (RIGHT SIDE BOTTOM) */}
                        <div className="absolute top-[500px] right-[100px] planet-mercury spin-slow z[100]">
                            <div className="planet-glow" style={{ color: "#cccccc" }}></div>
                        </div>


                        {/* JUPITER */}
                        <div className="absolute top-20 left-20 planet-jupiter spin">
                            <div className="planet-glow" style={{ color: "#d8b48a" }}></div>
                        </div>

                        {/* EARTH + MOON ORBIT */}

                        <div className="absolute top-[260px] left-[190px] earth-orbit-wrapper">

                            <div className="earth-orbit-circle">
                                <div className="planet-moon"></div>
                            </div>

                            <div className="planet-earth"></div>

                        </div>


                        {/* SATURN */}


                        <div className="absolute top-[530px] left-[70px] saturn-wrapper">
                            <div className="saturn-rotator">

                                <div className="ring ring-back"></div>

                                <div className="planet-saturn"></div>

                                <div className="ring ring-front"></div>

                            </div>
                        </div>

                        {/* RANDOM SHOOTING STARS */}
                        <div className="shooting-star"></div>

                        {/* FLOATING ASTEROIDS */}
                        <div className="asteroid asteroid-1"></div>
                        <div className="asteroid asteroid-2"></div>
                        <div className="asteroid asteroid-3"></div>
                        <div className="absolute top-24 right-16 planet-sun spin-slow">
                            <div className="planet-glow" style={{ color: "#ff9900" }}></div>
                        </div>

                        <div className="micro-stars"></div>
                        <div className="mega-stars"></div>


                    </div>

                </div>
            </div>

        </>);
}
