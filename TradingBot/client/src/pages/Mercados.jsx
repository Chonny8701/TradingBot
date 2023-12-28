import React from 'react'
import CriptoInfo from '../components/CriptoInfo';
import '../scss/pages/Mercados.scss'
import bitcoin from '../images/bitcoin.svg'
import ethereum from '../images/ethereum.svg'
import solana from '../images/solana.svg'
import polkadot from '../images/polkadot.svg'
import cardano from '../images/cardano.svg'


const Mercados = () => {
  return ( 
    <div className='d-flex flex-wrap gap-2 container mercados-container justify-content-center'>
      <CriptoInfo url_images = {bitcoin} nombre = {"Bitcoin"} />
      <CriptoInfo url_images = {ethereum} nombre = {"Ethereum"} />
      <CriptoInfo url_images = {solana} nombre = {"Solana"} />
      <CriptoInfo url_images = {polkadot} nombre = {"Polkadot"} />
      <CriptoInfo url_images = {cardano} nombre = {"Cardano"} />
    </div>
   );
}
 
export default Mercados;