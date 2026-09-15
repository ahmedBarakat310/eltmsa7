import React from 'react'

import Hero from './component/Hero'

import ProductsSection from './component/ProductsSection'
import Features from './component/Features'
import Footer from './component/Footer'
import Navbar from './component/Navbar'
import InstallAppButton from './component/InstallAppButton'



const HomePage = () => {
  return (
     <main dir="rtl" className="min-h-screen bg-[#fffdf7]">
     <Navbar/>
      <Hero/>
      <ProductsSection/>
      <Features/>
      <Footer/>
               <InstallAppButton/>

    </main>
  )
}

export default HomePage