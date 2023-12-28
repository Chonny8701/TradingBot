import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';

const GraficaVelas = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [candlestickData, setCandlestickData] = useState(null);
  const [layout, setLayout] = useState(null);

  // console.log(data)

  // Funcion para que actualice escala de eje Y para mejor visualizacion por tramos cuando cambian las coordenadas de inicio de x
  const handleRelayout = (event) => {
    // Acceder a los datos de los campos
    const rangoEjeX = event['xaxis.range'];

    // Comprobar que se tiene la x de inicio y la x de fin
    if (rangoEjeX.length === 2) {
      // Obtener las coordenadas de inicio y fin en eje 'x' y convertirlas a tipo date
      let [xInicio, xFin] = rangoEjeX;
      const xInicioDate = new Date (xInicio)
      const xFinDate = new Date (xFin)

      // Convertir las coordenadas del eje x de tipo string a tipo Date
      const xDate = data.data[0].x.map((fechaString) => new Date(fechaString));
      
      // Obtener el indice del valor de inicio y del valor de fin
      let x_indice_inicio
      let x_indice_fin
      xDate.findIndex((objeto) => objeto >= xInicioDate) != -1 ? x_indice_inicio = xDate.findIndex((objeto) => objeto >= xInicioDate) : x_indice_inicio = 0
      xDate.findIndex((objeto) => objeto >= xFinDate) != -1 ? x_indice_fin = xDate.findIndex((objeto) => objeto >= xFinDate) : x_indice_fin = data.data[0].x.length -1

      // Buscar el minimo en el arrglo low y el máxmimo en el arreglo high
      const arreglo_Low = data.data[0].low;
      const arreglo_High = data.data[0].high;

      // Obtener el tramo de candlestickData.low y candlestickData.high que se encuentre entre xInicio y xFin
      const porcionEjeYLow = arreglo_Low.slice(x_indice_inicio, x_indice_fin)
      const porcionEjeYHigh = arreglo_High.slice(x_indice_inicio, x_indice_fin)

      // Encontrar el valor menor
      // Convertir las cadenas a números usando map
      const yLowToNumber = porcionEjeYLow.map(Number);
      // Encontrar el valor mínimo con Math.min
      const minimo = Math.min(...yLowToNumber);

      // Encontrar el valor mayor
      // Convertir las cadenas a números usando map
      const yHighToNumber = porcionEjeYHigh.map(Number);
      // Encontrar el valor mínimo con Math.min
      const maximo = Math.max(...yHighToNumber);

      // Crear un rango nuevo para el eje Y entre los valores anteriormente calculados y darle una margen de 10% por arriba y por abajo
      const nuevoRangoY = [minimo, maximo];

      // Actualiza el layout con el nuevo rango
      setLayout((prevLayout) => ({
        ...prevLayout,
        yaxis: { ...prevLayout.yaxis, autorange: false, range: nuevoRangoY },
      }));
    }
  };

  useEffect(() => {
    if (data && data.data && data.data[0]) {
      const candleData = data.data[0];
      const xLength = candleData.x.length;

      if (
        xLength === candleData.open.length &&
        xLength === candleData.high.length &&
        xLength === candleData.low.length &&
        xLength === candleData.close.length
      ) {
        // Darle el formato a los valores del arreglo que contiene los datos de las velas
        const candleStickDataFormateada = {
          x: candleData.x,
          close: candleData.close,
          high: candleData.high,
          low: candleData.low,
          open: candleData.open,
          type: candleData.type,
          
        };
        // Añadir datos de las velas al hook candlestickData
        setCandlestickData(candleStickDataFormateada);

        // Si ya se tienen los valores de la grafica desactivar mensaje de loading
        setLoading(false);
      }
      setLayout({
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.8,
    
        title: data.layout.title,
        xaxis: data.layout.xaxis,
        yaxis: data.layout.yaxis
      })
    }
  }, [data]);


  useEffect(() => {
    const handleResize = () => {
      setLayout((prevLayout) => ({
        ...prevLayout,
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.8,
      }));
    };

    // Suscribirse al evento de cambio de tamaño después de que el componente se haya montado
    window.addEventListener('resize', handleResize);

    // Limpiar la suscripción al desmontar el componente
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); 



  // Mostrar mensja de cargando datos mientras se obtienen los datos de la grafica
  if (loading) {
    return <div style={{marginTop: "50px"}}>Cargando datos...</div>;
  }

  // En caso de que no hay datos de las velas mostrar mensaje de que no se tienen los datos
  if (!candlestickData) {
    return <div>No hay datos de velas disponibles o la estructura es incorrecta.</div>;
  }

  return (
    <Plot data={[candlestickData]} layout={layout} onRelayout={handleRelayout} />
  );
};

export default GraficaVelas;
