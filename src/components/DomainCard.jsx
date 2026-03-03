import { useNavigate } from "react-router-dom";
import TopNavbar from "../components/topnav";
export default function DomainCard({ domain }) {
    const navigate = useNavigate();
    return (


        <div className="p-6 rounded-xl border border-white/10 backdrop-blur-md hover:border-blue-800/90 transition-all">
            <h3 className="text-xl font-semibold text-white mb-3">
                {domain.name}
            </h3>
            <p className="text-gray-400 mb-3">
                {domain.description}
            </p>
            <p className="text-blue-400 text-md mb-3">
                Match Score: {domain.score}
            </p>
            <button
                onClick={() => navigate(`/learn/domain/${domain.id}`)}
                className="mt-4 px-4 py-2 bg-blue-800 rounded-lg"
            >
                View Roadmap
            </button>
        </div>

    );
}
