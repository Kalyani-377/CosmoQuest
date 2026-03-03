import React from 'react';

export default function MarkdownContent({ content }) {
    if (!content) return null;

    // Simple regex for basic markdown
    const renderContent = (text) => {
        let parts = [text];

        // Bold: **text**
        parts = parts.flatMap(part => {
            if (typeof part !== 'string') return part;
            const regex = /\*\*(.*?)\*\*/g;
            const subparts = [];
            let lastIndex = 0;
            let match;
            while ((match = regex.exec(part)) !== null) {
                if (match.index > lastIndex) {
                    subparts.push(part.substring(lastIndex, match.index));
                }
                subparts.push(<strong key={match.index} className="font-bold text-blue-400">{match[1]}</strong>);
                lastIndex = regex.lastIndex;
            }
            if (lastIndex < part.length) {
                subparts.push(part.substring(lastIndex));
            }
            return subparts;
        });

        // Italic: *text*
        parts = parts.flatMap(part => {
            if (typeof part !== 'string') return part;
            const regex = /\*(.*?)\*/g;
            const subparts = [];
            let lastIndex = 0;
            let match;
            while ((match = regex.exec(part)) !== null) {
                if (match.index > lastIndex) {
                    subparts.push(part.substring(lastIndex, match.index));
                }
                subparts.push(<em key={match.index} className="italic text-purple-400">{match[1]}</em>);
                lastIndex = regex.lastIndex;
            }
            if (lastIndex < part.length) {
                subparts.push(part.substring(lastIndex));
            }
            return subparts;
        });

        // Links: [text](url)
        parts = parts.flatMap(part => {
            if (typeof part !== 'string') return part;
            const regex = /\[(.*?)\]\((.*?)\)/g;
            const subparts = [];
            let lastIndex = 0;
            let match;
            while ((match = regex.exec(part)) !== null) {
                if (match.index > lastIndex) {
                    subparts.push(part.substring(lastIndex, match.index));
                }
                subparts.push(
                    <a
                        key={match.index}
                        href={match[2]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 underline hover:text-cyan-300 transition-colors"
                    >
                        {match[1]}
                    </a>
                );
                lastIndex = regex.lastIndex;
            }
            if (lastIndex < part.length) {
                subparts.push(part.substring(lastIndex));
            }
            return subparts;
        });

        return parts;
    };

    return <>{renderContent(content)}</>;
}
