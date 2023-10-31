"use client"

import { useEffect,useState } from 'react'
import useWebSocket from 'react-use-websocket';

import { getData } from '@/services/DataService'
import Chart from './components/Chart';
import CandlePoint from '@/lib/CandlePoint';
import LinePoint from '@/lib/LinePoint';

export default function Home() {

  const [symbol, setSymbol]= useState("BTCUSDT");
  const [interval, setInterval]= useState("1m");
  const [data, setData] = useState({});

  useEffect(()=>{
    getData(symbol, interval)
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, [symbol, interval]);

  function onSymbolChange(evt){
    setSymbol(evt.target.value);
  }

  function onIntervalChange(evt){
    setInterval(evt.target.value);
  }

  const {lastJsonMessage} = useWebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`,{
    onOpen: ()=> console.log("Connected to Ws"),
    onError: (evt) => console.error(evt),
    shouldReconnect: ()=> true,
    reconnectInterval: 3000,
    onMessage: ()=>{
      if(!lastJsonMessage) return;

      // console.log(lastJsonMessage);

      const newCandle = new CandlePoint(lastJsonMessage.k.t, lastJsonMessage.k.h, lastJsonMessage.k.l, lastJsonMessage.k.c);

      const newCandles = [...data.candles];
      const newSupport = [...data.support];
      const newResistance = [...data.resistance];

      if(lastJsonMessage.k.x ===false){
        newCandles[newCandles.length - 1] = newCandle;
      } else{
        newCandles.splice(0,1);
        newCandles.push(newCandle);

        newSupport.splice(1,1);
        newSupport.push(new LinePoint(newCandle. x, newSupport[0].y));

        newResistance.splice(1,1);
        newResistance.push(new LinePoint(newCandle.x, newResistance[0].y));
      }

      setData({
        candles: newCandles,
        support: newSupport,
        resistance: newResistance
      })
    }
  });

  return (
    <>
      <select value={symbol} onChange={onSymbolChange} > 
        <option>BTCUSDT</option>
        <option>ETHUSDT</option>
        <option>ADAUSDT</option>
      </select>

      <select value={interval} onChange={onIntervalChange} >
        <option>1m</option>
        <option>1h</option>
        <option>1d</option>
      </select>
      <Chart data={data} />
      
         
    </>
  )
}
