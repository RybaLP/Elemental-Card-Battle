import AnimatedBackground from "@/components/animatedBg"
import Image from "next/image"
import ContinueButton from "./components/continueButton"

export default function Home() {
  return (
    <main className="relative min-h-screen">


      <AnimatedBackground />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4">
       
      <Image alt="logo" width={200} height={200} src={"/logo-.png"} />      
      <ContinueButton />
        
      </div>
    </main>
  )
}