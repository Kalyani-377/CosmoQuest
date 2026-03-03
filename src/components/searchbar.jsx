import "../styles/searchbar.css";

export default function SearchBar({ onSearch }) {
    return (
        <div className="search-wrapper">
            <input
                type="text"
                placeholder="Search by city or country..."
                onChange={(e) => onSearch(e.target.value)}
                className="search-input"
            />
        </div>
    );
}
