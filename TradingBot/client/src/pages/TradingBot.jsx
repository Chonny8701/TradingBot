import React, { useState, useEffect } from 'react';
import GraficaIndicadores from '../components/GraficaIndicadores';

import Form from 'react-bootstrap/Form';
import '../scss/pages/Home.scss';

const TradingBot = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cripto, setCripto] = useState("BTCUSDT")
  const [temporalidad, setTemporalidad] = useState("1h")
  const [rsi, setRSI] = useState("true")
  const [ema, setEMA] = useState ("true")

  useEffect(() => {
    const url = import.meta.env.VITE_SERVER_ROUTE + '/binance/grafica-velas/' + cripto + '/' + temporalidad + '/' + ema  + '/' + rsi;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const dataJSON = JSON.parse(data)
        setChartData(dataJSON);
        setLoading(false);
 
      })
      .catch(error => {
        console.error('Error fetching chart data:', error);
        setLoading(false);
      });
  }, [cripto, temporalidad, ema, rsi]);

  const actualizarCripto = (e) => {
    setCripto(e.target.value)
    console.log(e.target.value)
  }
  
  const actualizarTemporalidad = (e) => {
    setTemporalidad(e.target.value)
    console.log(e.target.value)
  }

  const actualizarEMA = (e) => {
    setEMA(e.target.value)
    console.log(e.target.value)
  }

  const actualizarRSI = (e) => {
    setRSI(e.target.value)
    console.log(e.target.value)
  }

  return (
    <div>
      <div className='d-flex justify-content-center flex-wrap'>
        <Form.Select aria-label="Default select example" style={{width:"250px"}} value={cripto} onChange={actualizarCripto}>
          <option value="BTCUSDT">BTC/USDT</option>
          <option value="ETHUSDT">ETH/USDT</option>
          <option value="DOTUSDT">DOT/USDT</option>
          <option value="SOLUSDT">SOL/USDT</option>
          <option value="ADAUSDT">ADA/USDT</option>
        </Form.Select>
        <Form.Select aria-label="Default select example" style={{width:"250px"}} value={temporalidad} onChange={actualizarTemporalidad}>
          <option value="1h">Temporalidad (1h)</option>
          <option value="4h">Temporalidad (4h)</option>
          <option value="8h">Temporalidad (8h)</option>
        </Form.Select>
        <Form.Select aria-label="Default select example" style={{width:"250px"}} value={ema} onChange={actualizarEMA}>
          <option value="true">Indicador EMAs (Activar)</option>
          <option value="false">Indicador EMAs (Desactivar)</option>
        </Form.Select>
        <Form.Select aria-label="Default select example" style={{width:"250px"}} value={rsi} onChange={actualizarRSI}>
          <option value="true">Indicador RSI (Activar)</option>
          <option value="false">Indicador RSI (Desactivar)</option>
        </Form.Select>
      </div>
      {!loading && chartData ? (
        <div>
          <GraficaIndicadores data={chartData} cripto={cripto} intervalo= {temporalidad} />
        </div>
      ) : (
        <p style={{marginTop: "50px"}}>{loading ? 'Cargando gráfica...' : 'Error al cargar los datos de la gráfica.'}</p>
      )}
    </div>
  );
};

export default TradingBot;
