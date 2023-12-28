import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { format } from 'date-fns';

const GraficaIndicadores = ({ data }) => {
  const [loading, setLoading] = useState(true);
  const [candlestickData, setCandlestickData] = useState(null);
  const [ema20, setEma20] = useState([]);
  const [ema50, setEma50] = useState([]);
  const [ema100, setEma100] = useState([]);
  const [rsi, setRSI] = useState([]);
  const [rsiMin, setRSIMin] = useState([]);
  const [rsiMax, setRSIMax] = useState([]);
  const [datosGraficasUnidas, setDatosGraficasUnidas] = useState([]);
  const [layout, setLayout] = useState({
    width: window.innerWidth * 0.8,
    height: window.innerHeight * 0.8,
    grid: {
      rows: 2,
      columns: 1,
      subplots: [['xy2'], ['xy']],
      roworder: 'bottom to top',
    },
    yaxis: { domain: [0.2, 1], autorange: true }, 
    yaxis2: { domain: [0, 0.2] },
    shapes: [
      {
        type: 'rect',
        xref: 'x',
        yref: 'y2',
        x0: 0, // Inicializa con un valor adecuado
        y0: 0, // Inicializa con un valor adecuado
        x1: 1, // Inicializa con un valor adecuado
        y1: 1, // Inicializa con un valor adecuado
        fillcolor: 'rgba(31,119,180,1)',
        opacity: 1,
        line: {
          width: 0,
        },
      },
    ],
    annotations: data.layout.annotations
  });

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
      const xDate = data.data[4].x.map((fechaString) => new Date(fechaString));

      // Obtener el indice del valor de inicio y del valor de fin
      let x_indice_inicio
      let x_indice_fin
      xDate.findIndex((objeto) => objeto >= xInicioDate) != -1 ? x_indice_inicio = xDate.findIndex((objeto) => objeto >= xInicioDate) : x_indice_inicio = 0
      xDate.findIndex((objeto) => objeto >= xFinDate) != -1 ? x_indice_fin = xDate.findIndex((objeto) => objeto >= xFinDate) : x_indice_fin = data.data[4].x.length -1
      
      console.log("FechaInicio: "+xInicio);
      console.log("FechaFin: "+xFin);
      console.log("Indice Fecha Inicio : "+x_indice_inicio);
      console.log("Indice Fecha Fin: "+x_indice_fin);

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
      console.log("Actualizando escala en Y:" + JSON.stringify(nuevoRangoY))
      // Actualiza el layout con el nuevo rango
      setLayout((prevLayout) => ({
        ...prevLayout,
        yaxis: { ...prevLayout.yaxis, autorange: false, range: nuevoRangoY },
      }));
    }
  };

  // Configura la data que recibe como parametro para trazar las diferentes graficas y las almacena en los hooks
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
        // Formatear la fecha que serian los valores de eje x
        const formattedDates = candleData.x.map((timestamp) => format(new Date(timestamp), 'yyyy-MM-dd HH:mm'));

        // Darle el formato a los valores del arreglo que contiene los datos de las velas
        const candleStickDataFormateada = {
          x: candleData.x,
          close: candleData.close,
          high: candleData.high,
          low: candleData.low,
          open: candleData.open,
          name: "Velas",
          type: candleData.type,
        };
        // Añadir datos de las velas al hook candlestickData
        setCandlestickData(candleStickDataFormateada);

        // Comprobar si se tienen los datos de la EMA 20 y en caso correcto almacenarlos en el hook ema20
        const contieneEMA20 = data.data.find(grafica => grafica.name === "EMA 20");
        if (contieneEMA20 !== undefined) {
          setEma20(contieneEMA20)
        } else {
          setEma20([])
        }

        // Comprobar si se tienen los datos de la EMA 50 y en caso correcto almacenarlos en el hook ema50
        const contieneEMA50 = data.data.find(grafica => grafica.name === "EMA 50");
        if (contieneEMA50 !== undefined) {
          setEma50(contieneEMA50)
        } else {
          setEma50([])
        }

        // Comprobar si se tienen los datos de la EMA 100 y en caso correcto almacenarlos en el hook ema100
        const contieneEMA100 = data.data.find(grafica => grafica.name === "EMA 100");
        if (contieneEMA100 !== undefined) {
          setEma100(contieneEMA100)
        } else {
          setEma100([])
        }

        // Comprobar si se tienen los datos del RSI y en caso correcto almacenarlos en el hook rsi
        const contieneRSI = data.data.find(grafica => grafica.name === "RSI");
        if (contieneRSI !== undefined) {
          setRSI(contieneRSI)
        } else {
          setRSI([])
        }

        // Comprobar si se tienen los datos del RSIMin y en caso correcto almacenarlos en el hook rsiMin
        const contieneRSIMin = data.data.find(grafica => grafica.name === "RSI 20");
        if (contieneRSIMin !== undefined) {
          setRSIMin(contieneRSIMin)
        }

        // Comprobar si se tienen los datos del RSIMax y en caso correcto almacenarlos en el hook rsiMax
        const contieneRSIMax = data.data.find(grafica => grafica.name === "RSI 80");
        if (contieneRSIMax !== undefined) {
          setRSIMax(contieneRSIMax)
        }

        // Si ya se tienen los valores de la grafica desactivar mensaje de loading
        setLoading(false);
      }
    }
  }, [data]);

  // Segun la informacion almacenada en los hooks configura la grafica a mostrar
  useEffect(() => {
    // Almacena los datos de todas las graficas que se quieren plotear. Siempre debe contener al menos las velas
    let graficas_a_plotear = [candlestickData];

    // Añadir a graficas a plotear la EMA 20 en caso de que exista
    if (candlestickData && ema20 && ema20.y && ema20.y.length > 0) {
      const ema20Trace = {
        x: candlestickData.x,
        y: ema20.y,
        xaxis: 'x',
        yaxis: 'y',
        type: 'scatter',
        mode: 'lines',
        name: 'EMA 20',
        line: { color: ema20.line.color },
      };
      graficas_a_plotear.push(ema20Trace)
    }

    // Añadir a graficas a plotear la EMA 50 en caso de que exista
    if (candlestickData && ema50 && ema50.y && ema50.y.length > 0) {
      const ema50Trace = {
        x: candlestickData.x,
        y: ema50.y,
        xaxis: 'x',
        yaxis: 'y',
        type: 'scatter',
        mode: 'lines',
        name: 'EMA 50',
        line: { color: ema50.line.color },
      };
      graficas_a_plotear.push(ema50Trace)
    }

    // Añadir a graficas a plotear la EMA 100 en caso de que exista
    if (candlestickData && ema100 && ema100.y && ema100.y.length > 0) {
      const ema100Trace = {
        x: candlestickData.x,
        y: ema100.y,
        xaxis: 'x',
        yaxis: 'y',
        type: 'scatter',
        mode: 'lines',
        name: 'EMA 100',
        line: { color: ema100.line.color },
      };
      graficas_a_plotear.push(ema100Trace)
    }

    // Añadir a graficas a plotear el RSI con su min, su maximo
    if (candlestickData && rsi && rsi.y && rsi.y.length > 0) {
      const rsiTrace = {
        x: candlestickData.x,
        y: rsi.y,
        xaxis: 'x',
        yaxis: 'y2',
        type: 'scatter',
        name: rsi.name,
        line: { color: rsi.line.color },
      };
      graficas_a_plotear.push(rsiTrace)

      const rsiMinTrace = {
        x: candlestickData.x,
        y: rsiMin.y,
        xaxis: 'x',
        yaxis: 'y2',
        type: 'scatter',
        name: rsiMin.name,
        line: { color: rsiMin.line.color },
      };
      graficas_a_plotear.push(rsiMinTrace)

      const rsiMaxTrace = {
        x: candlestickData.x,
        y: rsiMax.y,
        xaxis: 'x',
        yaxis: 'y2',
        type: 'scatter',
        name: rsiMax.name,
        line: { color: rsiMax.line.color },
      };
      graficas_a_plotear.push(rsiMaxTrace)
    }

    // Cuando se hayan guardado todas las graficas_a_plotear se le pasan al hook datosGraficasUnidas
    setDatosGraficasUnidas(graficas_a_plotear);

    // Actualizar configuracion del layout para dividir en subplot['xy2'] y subplot['xy']. El subplot['xy2'] solo se mostrará si existen datos del rsi
    // Configuracion del grid con 2 filas y 1 columna. Añadir el sombreado del area del rsi con shape
    if (candlestickData && rsi && rsi.y && rsi.y.length > 0){
      // console.log("Actualizar Grafica con RSI: "+JSON.stringify(data.layout.title.text))
      const layoutActualizado = {
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.8,
        grid: {
          rows: 2,
          columns: 1,
          subplots: [['xy2'], ['xy']],
          roworder: 'bottom to top',
        },
        yaxis: { domain: [0.2, 1], autorange: true }, 
        yaxis2: { domain: [0, 0.2] },
        shapes: [
          {
            type: 'rect',
            xref: 'x',
            yref: 'y2',
            x0: candlestickData.x[0] || 0,
            y0: rsiMin.y[0] || 0,
            x1: candlestickData.x[candlestickData.x.length - 1]|| 0,
            y1: rsiMax.y[rsiMax.y.length - 1] || 0,
            fillcolor: 'rgba(31,119,180,0.5)',
            opacity: 0.5,
            line: {
              width: 0,
            },
          },
        ],
        annotations: data.layout.annotations
      };
      setLayout (layoutActualizado)

      // Configuracion del grid con 1 fila y 1 columna
    } else {
      // console.log("Actualizar Grafica sin RSI: "+JSON.stringify(allData.layout))
      const layoutActualizado = {
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.8,
        grid: {
          rows: 1,
          columns: 1,
          subplots: [['xy']],
          roworder: 'bottom to top',
        },
        yaxis: { domain: [0, 1], autorange: true },
        annotations: data.layout.annotations
      };
      setLayout (layoutActualizado)
    }
  }, [data, ema20, rsi, candlestickData]);

  // 
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
    <Plot data={datosGraficasUnidas} layout={layout} onRelayout={handleRelayout} />
  );
};

export default GraficaIndicadores;
