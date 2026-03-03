// import React from "react";

export default function AspectCard({ id, label, selected, onToggle }) {
    const isSelected = selected.includes(id);

    return (
        <div
            onClick={() => onToggle(id)}
            className={`
        p-6 rounded-xl cursor-pointer transition-all duration-300 
        border backdrop-blur-md
        ${isSelected
                    ? " border-blue-400 shadow-lg shadow-blue-600/30"
                    : " border-white/10 hover:border-blue-400/50"
                }
      `}
        >
            <h3
                className={`text-lg font-semibold tracking-wide ${isSelected ? "text-white" : "text-gray-300"
                    }`}
            >
                {label}
            </h3>
        </div>
    );
}
