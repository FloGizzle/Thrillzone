import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

const SpinningWheel = () => {
    const names = [
        "Alice", "Bob", "Charlie", "David",
        "Eve", "Frank", "Grace", "Henry"
    ];

    const [spinning, setSpinning] = useState(false);
    const [selectedName, setSelectedName] = useState(null);
    const [rotation, setRotation] = useState(0);
    const wheelRef = useRef(null);

    const spinWheel = () => {
        if (spinning) return;

        setSpinning(true);
        setSelectedName(null);

        const currentRotation = rotation % 360;
        const segmentSize = 360 / names.length;
        const selectedIndex = Math.floor(Math.random() * names.length);

        // Calculate a random position within the selected segment
        const segmentStart = -(selectedIndex * segmentSize + 90);
        const randomOffset = Math.random() * segmentSize;
        const targetRotation = segmentStart - randomOffset;

        // Calculate required rotation to reach the target
        let requiredRotation = targetRotation - currentRotation;
        if (requiredRotation > 0) {
            requiredRotation = requiredRotation - 360;
        }

        // Add minimum number of full rotations (20-25 spins)
        const minimumRotations = 20;
        const extraRotations = Math.floor(Math.random() * 5);
        const totalRotations = minimumRotations + extraRotations;
        const fullSpinsRotation = -totalRotations * 360;

        const finalRotation = rotation + requiredRotation + fullSpinsRotation;
        setRotation(finalRotation);

        setTimeout(() => {
            setSpinning(false);
            setSelectedName(names[selectedIndex]);
        }, 3000);
    };

    const getSegmentPath = (index) => {
        const segmentAngle = 360 / names.length;
        const startAngle = index * segmentAngle;
        const endAngle = (index + 1) * segmentAngle;

        const start = {
            x: 50 + 50 * Math.cos((startAngle * Math.PI) / 180),
            y: 50 + 50 * Math.sin((startAngle * Math.PI) / 180)
        };

        const end = {
            x: 50 + 50 * Math.cos((endAngle * Math.PI) / 180),
            y: 50 + 50 * Math.sin((endAngle * Math.PI) / 180)
        };

        const largeArcFlag = segmentAngle <= 180 ? 0 : 1;

        return `M 50 50 L ${start.x} ${start.y} A 50 50 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
    };

    return (
        <div className="flex flex-col items-center gap-8 p-8">
            <div className="relative w-64 h-64">
                <svg
                    ref={wheelRef}
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: spinning
                            ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)'
                            : 'none'
                    }}
                >
                    {names.map((name, index) => {
                        const angle = (360 / names.length) * index;
                        const segmentPath = getSegmentPath(index);
                        const textAngle = angle + (360 / names.length / 2);
                        const textRadius = 35;
                        const textX = 50 + textRadius * Math.cos((textAngle * Math.PI) / 180);
                        const textY = 50 + textRadius * Math.sin((textAngle * Math.PI) / 180);

                        return (
                            <g key={name}>
                                <path
                                    d={segmentPath}
                                    fill={`hsl(${(360 / names.length) * index}, 70%, 70%)`}
                                    stroke="white"
                                    strokeWidth="0.5"
                                />
                                <text
                                    x={textX}
                                    y={textY}
                                    fill="white"
                                    fontSize="6"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    transform={`rotate(${angle}, ${textX}, ${textY})`}
                                >
                                    {name}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                {/* Made the pointer a bit thinner but taller for better precision */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-4 h-8 bg-black transform rotate-45" />
            </div>

            <Button
                onClick={spinWheel}
                disabled={spinning}
                className="px-6 py-2"
            >
                {spinning ? 'Spinning...' : 'Spin the Wheel!'}
            </Button>

            {selectedName && (
                <div className="text-xl font-bold">
                    Selected: {selectedName}
                </div>
            )}
        </div>
    );
};

export default SpinningWheel;