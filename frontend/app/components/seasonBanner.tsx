import Image from "next/image";
import ContinueButton from "./continueButton";

export default function SeasonBanner() {
  return (
    <header className="text-center py-16">
      <Image
        alt="Cardjitsu logo"
        width={200}
        height={200}
        src="/logo-.png"
        className="mx-auto animate-pulse"
        priority
      />
      
      {/* Season 1 Title with Animation */}
      <div className="mt-12 mb-8">
        <h1 className="text-7xl font-black tracking-widest mb-4 animate-fade-in">
          <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            SEASON 1
          </span>
        </h1>
        
        <div className="h-1 w-40 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-6 animate-pulse"></div>
        
        <p className="text-3xl text-gray-300 font-light tracking-wider animate-slide-in">
          First Tournament
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center justify-center gap-4 my-12">
        <div className="w-12 h-1 bg-gradient-to-r from-purple-500 to-transparent"></div>
        <span className="text-purple-400 font-black text-xl">✦</span>
        <div className="w-12 h-1 bg-gradient-to-l from-purple-500 to-transparent"></div>
      </div>

      {/* CTA Button */}
      <div className="mt-12">
        <ContinueButton />
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slide-in {
          animation: slideIn 1s ease-out 0.2s both;
        }
      `}</style>
    </header>
  );
}