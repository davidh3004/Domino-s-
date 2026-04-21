import Navbar from '@/components/Navbar'
import CustomizerSection from '@/components/Customizer/CustomizerSection'

export default function CustomizePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-950 pt-16">
        <CustomizerSection />
      </main>
    </>
  )
}
