// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { createChart, ColorType, UTCTimestamp } from 'lightweight-charts';
// import Binance from 'binance-api-node';

// @Component({
//   selector: 'app-realTimeTicket',
//   templateUrl: './realTimeTicket.component.html',
//   styleUrls: ['./realTimeTicket.component.css']
// })
// export class RealTimeTicketComponent implements OnInit, OnDestroy {

//   private client = Binance();
//   private candleUpdateListener: Function | null = null;

//   async ngOnInit() {
//     const chartOptions = { layout: { textColor: 'black', background: { type: ColorType.Solid, color: 'white' } } };
//     const container = document.getElementById('container');
//     if (container === null) {
//         throw new Error("Could not find element with id 'container'");
//     }
//     const chart = createChart(container, chartOptions);
//     const candlestickSeries = chart.addCandlestickSeries({
//         upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
//         wickUpColor: '#26a69a', wickDownColor: '#ef5350', 
//     });
//     function timeToLocal(originalTime: number): UTCTimestamp {
//         return Math.floor(originalTime / 1000) as UTCTimestamp;
//       }
//     const candles = await this.client.candles({ symbol: 'BTCUSDT', interval: '1m' });
//     const data = candles.map(candle => ({
//         time: timeToLocal(candle.closeTime),
//         open: parseFloat(candle.open),
//         high: parseFloat(candle.high),
//         low: parseFloat(candle.low),
//         close: parseFloat(candle.close),
//     }));

//     candlestickSeries.setData(data);
//     chart.timeScale().fitContent();

//     this.candleUpdateListener = this.client.ws.candles('BTCUSDT', '1m', candle => {
//       const newCandle = {
//         time: timeToLocal(candle.closeTime),
//         open: parseFloat(candle.open),
//         high: parseFloat(candle.high),
//         low: parseFloat(candle.low),
//         close: parseFloat(candle.close),
//       };
//       candlestickSeries.update(newCandle);
//     });
//   }

//   ngOnDestroy() {
//     if (this.candleUpdateListener) {
//       this.candleUpdateListener();
//     }
//   }
  
// }