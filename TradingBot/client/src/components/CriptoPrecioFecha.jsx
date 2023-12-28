import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';

const CriptoPrecioFecha = ({ nombre }) => {
  const [loading, setLoading] = useState(true);
  const [precio, setPrecio] = useState('');
  const [fecha, setFecha] = useState('');
  let par_cripto;
  let intervalId;

  useEffect(() => {
    const fetchData = () => {
      if (nombre === 'Bitcoin') par_cripto = 'BTCUSDT';
      if (nombre === 'Ethereum') par_cripto = 'ETHUSDT';
      if (nombre === 'Cardano') par_cripto = 'ADAUSDT';
      if (nombre === 'Solana') par_cripto = 'SOLUSDT';
      if (nombre === 'Polkadot') par_cripto = 'DOTUSDT';

      const url = import.meta.env.VITE_SERVER_ROUTE + '/binance/cripto/' + par_cripto;
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          // const dataJSON = JSON.parse(data);
          setPrecio(data.precio);
          setFecha(data.fecha_hora);
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
  }, [nombre]);

  return (
    <>
      {!loading ? (
        <Card.Text className='d-flex flex-column align-items-start'>
          <div>
            <b>Precio: </b> {precio}
          </div>
          <div>
            <b>Fecha: </b> {fecha}
          </div>
        </Card.Text>
      ) : (
        <Card.Text className='d-flex flex-column align-items-start'>
          <div>
            <b>Cargando info de la criptomoneda ... </b>
          </div>
        </Card.Text>
      )}
    </>
  );
};

export default CriptoPrecioFecha;
