import { domains } from "../data/domains";

export function getRecommendations(selectedAspects) {
    if (selectedAspects.length === 0) return [];

    const scored = domains.map((domain) => {
        let score = 0;

        selectedAspects.forEach((aspect) => {
            score += domain.weights[aspect] || 0;
        });

        return { ...domain, score };
    });

    // 🔥 Calculate maximum possible score
    const maxPossible = selectedAspects.length * 5;

    // 🔥 Only keep domains that have at least 50% relevance
    const filtered = scored.filter(
        (domain) => domain.score >= maxPossible * 0.5
    );

    // Sort remaining
    return filtered.sort((a, b) => b.score - a.score);
}
