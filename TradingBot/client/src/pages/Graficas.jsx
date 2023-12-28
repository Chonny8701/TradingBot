import React, { useState, useEffect } from 'react';
import GraficaVelas from '../components/GraficaVelas';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import '../scss/pages/Home.scss';

const Graficas = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cripto, setCripto] = useState("BTCUSDT")
  const [temporalidad, setTemporalidad] = useState("1h")
  const [precio, setPrecio] = useState('');
  let intervalId;

  useEffect(() => {
    const url = import.meta.env.VITE_SERVER_ROUTE + '/binance/grafica-velas/' + cripto + '/' + temporalidad + '/' + 'false'  + '/' + 'false';
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
      
  }, [cripto, temporalidad]);


  useEffect(() => {
    const fetchData = () => {
      const url = import.meta.env.VITE_SERVER_ROUTE + '/binance/cripto/' + cripto;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // const dataJSON = JSON.parse(data);
          setPrecio(Number(data.precio).toFixed(3));

          setLoading(false);
        })
        .catch((error) => {
          console.error('Error recibiendo información de criptos:', error);
          setLoading(false);
        });
    };

    // Realiza la primera llamada al montar el componente
    fetchData();

    // Establece un intervalo para realizar la petición cada 5 segundos
    intervalId = setInterval(() => {
      fetchData();
    }, 1000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, [cripto]);



  const actualizarCripto = (e) => {
    setCripto(e.target.value)
    console.log(e.target.value)
  }
  
  const actualizarTemporalidad = (e) => {
    setTemporalidad(e.target.value)
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
        <InputGroup  style={{width:"250px", color: 'red'}}>
          <InputGroup.Text id="basic-addon2">{cripto}</InputGroup.Text>
          <Form.Control  defaultValue={precio}
            placeholder="Valor cripto activo"
            aria-label="Valor cripto activo"
            aria-describedby="basic-addon2"
            readOnly
            style={{ color: 'green'}}
          />
        </InputGroup>
      </div>
      {!loading && chartData ? (
        <div>
          <GraficaVelas data={chartData} cripto={cripto} intervalo= {temporalidad} />
        </div>
      ) : (
        <p style={{marginTop: "50px"}}>{loading ? 'Cargando gráfica...' : 'Error al cargar los datos de la gráfica.'}</p>
      )}
    </div>
  );
};

export default Graficas;
