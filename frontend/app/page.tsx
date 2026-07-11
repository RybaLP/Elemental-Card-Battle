import AnimatedBackground from "@/components/animatedBg";
import SeasonBanner from "./components/seasonBanner";
import NewsSection from "./components/newsSection";
import TopPlayers from "./components/topPlayers";
import HowToPlay from "./components/howToPlay";
import SeasonCard from "./components/seasonCard";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4">
        <SeasonBanner />
        <NewsSection/>
        <SeasonCard/>
        <TopPlayers/>
        <HowToPlay/>
      </div>
    </main>
  );
}