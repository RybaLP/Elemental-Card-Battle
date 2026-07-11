import ProfileSection from "./components/profileSection";

export default function ProfilePage() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#0d0d1a] via-[#1a1a2e] to-[#0d0d1a] text-white">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-purple-900/5 via-transparent to-purple-900/5" />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        <ProfileSection />
      </div>
    </main>
  );
}