import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Header from './components/Header'
import Footer from './components/Footer'
import Graficas from './pages/Graficas'
import Mercados from './pages/Mercados'
import TradingBot from './pages/TradingBot'
import Error404 from './pages/Error404'

import 'bootstrap/dist/css/bootstrap.min.css';
import './scss/App.scss'


const App = () => {

  return (
    <>
      <Header />
      <div className='app-info-contenedor'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Mercados/>}/>
            <Route path="/grafica_velas" element={<Graficas/>}/>
            <Route path="/trading_bot" element={<TradingBot/>}/>
            <Route path="*" element={<Error404/>}/>
          </Routes>
        </BrowserRouter>
      </div>
      <Footer/>
    </>
  )
}

export default App
