import AspectCard from "./AspectCard";
import { aspects } from "../data/aspects";

export default function AspectGrid({
    selectedAspects,
    setSelectedAspects,
}) {
    const handleToggle = (id) => {
        setSelectedAspects((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            }
            if (prev.length < 3) {
                return [...prev, id];
            }
            return prev;
        });
    };

    return (
        <div className="mt-10">
            <p className="text-blue-400 font-medium tracking-wide mb-4">
                {selectedAspects.length} / 3 selected
            </p>

            <div className="grid grid-cols-4 gap-6">
                {aspects.map((aspect) => (
                    <AspectCard
                        key={aspect.id}
                        id={aspect.id}
                        label={aspect.name}
                        selected={selectedAspects}
                        onToggle={handleToggle}
                    />
                ))}
            </div>
        </div>
    );
}
