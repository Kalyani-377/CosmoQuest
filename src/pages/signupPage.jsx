import "./loginPage.css";
import { SignUp } from "@clerk/clerk-react";

export default function SignupPage() {
    return (
        <div className="login-container">
            {/* Background effects */}
            <div className="login-nebula"></div>
            <div className="login-stars"></div>
            <div className="login-stars2"></div>
            <div className="login-stars3"></div>
            <div className="login-starsMega"></div>
            <div className="login-glow"></div>

            {/* Clerk SignUp Component */}
            <div >
                <SignUp
                    routing="path"
                    path="/signup"
                    signInUrl="/login"
                    forceRedirectUrl="/homepage"
                    appearance={{
                        variables: {
                            colorPrimary: "#8b5cf6", //#2259ff66
                            colorBackground: "transparent",
                            colorInputBackground: "rgba(255,255,255,0.1)",
                            colorInputText: "white",
                            colorText: "white",
                            borderRadius: "12px",
                            fontFamily: "Orbitron",
                            marginTop: "10px",
                        },
                        elements: {
                            card: {
                                width: "380px",
                                padding: "40px",
                                backgroundColor: "rgba(10, 10, 40, 0.85)",
                                backdropFilter: "blur(20px)",
                                border: "1px solid rgba(255,255,255,0.1)",
                                // boxShadow: "0 0 40px rgba(124,92,255,0.4)",
                                fontFamily: "Orbitron",
                                zIndex: "10",
                                animation: "fadeIn 1.2s ease-out",
                                // boxShadow: "0 0 40px rgba(124,92,255,0.4)",
                            },
                            formButtonPrimary: {
                                width: "100%",
                                padding: "5px",
                                // background: "rgba(20, 93, 252, 0.3)",
                                border: "1px solid rgba(150, 180, 255, 0.6)",
                                borderRadius: "10px",
                                color: "white",
                                fontFamily: "Orbitron",
                                letterSpacing: "2px",
                                fontSize: "1.1rem",
                                cursor: "pointer",
                                transition: "0.3s",

                            },
                            formButtonPrimary__hover: {
                                // background: "linear-gradient(90deg, #6d4de6, #9333ea)",
                                boxShadow:
                                    "0 0 15px rgba(150, 200, 255, 0.8), 0 0 40px rgba(120, 160, 255, 0.6), 0 0 70px rgba(100, 140, 255, 0.4)",
                                transform: "scale(1.05)",
                            },
                            headerTitle: {
                                color: "white",
                            },
                            headerSubtitle: {
                                color: "#bbb",
                            },
                            footer: {
                                background: "transparent",
                                display: "none",
                            },
                            footerAction: {
                                color: "#aaa",
                            },
                            socialButtonsBlockButton: {
                                backgroundColor: "rgba(255,255,255,0.08)",
                                color: "white",
                            },
                        },
                    }}
                />
            </div>

            {/* Shooting star */}
            <div className="shooting-star z[1]"></div>
        </div>
    );
}