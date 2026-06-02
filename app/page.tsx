import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import About from '@/components/About'
import Services from '@/components/Services'
import Approach from '@/components/Approach'
import Process from '@/components/Process'
import Reviews from '@/components/Reviews'
import ContactForm from '@/components/ContactForm'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Services />
      <Approach />
      <Process />
      <Reviews />
      <ContactForm />
      <Footer />
    </main>
  )
}
