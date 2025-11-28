"use client";

import Image from "next/image";

const Enemy = () => {
    const cards = Array.from({ length: 4 });

    return (
        <div className="fixed right-0 bottom-0 h-40 bg-gray-800/80 w-1/2 backdrop-blur-md border-b border-gray-600">
            <div className="h-full flex items-start pt-3 pr-24 justify-end">
                <div className="flex gap-3 overflow-x-auto pl-8">
                    {cards.map((_, index) => (
                        <div
                            key={index}
                            className="w-28 h-36 rounded-xl overflow-hidden shadow-2xl border-2 border-gray-500 bg-gray-800"
                        >
                            <Image 
                                src="/card-back.png"
                                alt="Card Back"
                                width={112}
                                height={144}
                                className="w-full h-full object-cover"
                            />

                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Enemy;