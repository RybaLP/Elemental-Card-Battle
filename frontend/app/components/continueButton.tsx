"use client";

import { useRouter } from 'next/navigation'

const ContinueButton = () => {
  
    const navigate = useRouter();

    return (
        <button className="hover:cursor-pointer mt-12 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
         onClick={() => navigate.push("/login")}>
          Enter Game
        </button>
  )
}

export default ContinueButton