import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import CustomizerSection from '@/components/Customizer/CustomizerSection'
import Gallery from '@/components/Gallery'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CustomizerSection />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
