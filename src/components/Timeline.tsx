import React from 'react';

interface Stage {
    id: number;
    title: string;
    description: string;
}

const stages: Stage[] = [
    {
        id: 0,
        title: "No Diabetic Retinopathy",
        description: "The retina shows no signs of damage or vessel changes.",
    },
    {
        id: 1,
        title: "Mild Non-Proliferative DR",
        description: "Small areas of swelling (microaneurysms) occur in the retina's blood vessels.",
    },
    {
        id: 2,
        title: "Moderate Non-Proliferative DR",
        description: "Blood vessels swell and distort, losing their ability to transport blood.",
    },
    {
        id: 3,
        title: "Severe Non-Proliferative DR",
        description: "Many blood vessels are blocked, depriving the retina of blood supply.",
    },
    {
        id: 4,
        title: "Proliferative DR",
        description: "Fragile new blood vessels grow along the retina and into the vitreous gel.",
    },
];

interface TimelineProps {
    activeStage?: number;
}

const Timeline: React.FC<TimelineProps> = ({ activeStage }) => {
    return (
        <div className="w-full py-8">
            <div className="relative">
                {/* Connection Line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 lg:left-0 lg:right-0 lg:top-4 lg:bottom-auto lg:h-0.5 lg:w-full" />

                <div className="flex flex-col space-y-8 lg:flex-row lg:space-y-0 lg:justify-between">
                    {stages.map((stage) => {
                        const isActive = activeStage === stage.id;
                        return (
                            <div key={stage.id} className="relative flex items-start lg:flex-col lg:items-center lg:w-1/5">
                                {/* Circle */}
                                <div
                                    className={`flex-shrink-0 w-8 h-8 rounded-full border-4 flex items-center justify-center z-10 
                    ${isActive
                                            ? 'bg-medical-accent border-medical-accent/30'
                                            : 'bg-white border-gray-200'}`}
                                >
                                    {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>

                                {/* Content */}
                                <div className="ml-4 lg:ml-0 lg:mt-4 lg:text-center px-2">
                                    <h4 className={`text-sm font-bold ${isActive ? 'text-medical-accent' : 'text-gray-900'}`}>
                                        {stage.title}
                                    </h4>
                                    <p className="mt-1 text-xs text-gray-500 leading-normal max-w-[200px] lg:mx-auto">
                                        {stage.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Timeline;
