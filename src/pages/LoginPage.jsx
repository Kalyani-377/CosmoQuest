import "./loginPage.css";
import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
    return (
        <div className="login-container">
            <div className="login-nebula"></div>
            <div className="login-stars"></div>
            <div className="login-stars2"></div>
            <div className="login-stars3"></div>
            <div className="login-starsMega"></div>
            <div className="login-glow"></div>

            <SignIn
                routing="path"
                path="/login"
                signUpUrl="/signup"
                forceRedirectUrl="/homepage"
                appearance={{
                    variables: {
                        colorPrimary: "#8b5cf6",
                        colorBackground: "transparent",
                        colorInputBackground: "rgba(255,255,255,0.1)",
                        colorInputText: "white",
                        colorText: "white",
                        borderRadius: "16px",
                    },
                    elements: {
                        card: {
                            backgroundColor: "rgba(10, 10, 40, 0.85)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            boxShadow: "0 0 40px rgba(124,92,255,0.4)",
                            fontFamily: "Orbitron",
                        },
                        headerTitle: { color: "white" },
                        headerSubtitle: { color: "#bbb" },

                        formButtonPrimary: {
                            borderRadius: "20px",
                            height: "48px",
                            fontWeight: "600",
                            transition: "all 0.3s ease",
                            boxShadow: "0 0 15px rgba(124,92,255,0.4)",
                        },
                        formButtonPrimary__hover: {
                            boxShadow: "0 0 30px rgba(124,92,255,0.8)",
                            transform: "scale(1.05)",
                        },

                        socialButtonsBlockButton: {
                            backgroundColor: "rgba(255,255,255,0.08)",
                            color: "white",
                        },

                        footer: {
                            background: "transparent",
                            opacity: 1,  // 🔥 make it visible again
                        },
                        footerAction: {
                            color: "#8b5cf6",
                            fontWeight: "600",
                        },
                    },
                }}
            />

            <div className="shooting-star z[1]"></div>
        </div>
    );
}