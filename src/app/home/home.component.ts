// import {
//   Component,
//   OnInit,
//   AfterViewInit,
//   Renderer2,
//   ElementRef,
// } from '@angular/core';
// import Binance from 'binance-api-node';
// import { RouterOutlet } from '@angular/router';

// declare var TradingView: any;

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [RouterOutlet],
//   templateUrl: './home.component.html',
//   styleUrls: ['./home.component.css'],
// })
// export class HomeComponent implements OnInit, AfterViewInit {
//   private client: any;
//   private ws: any;

//   constructor(private renderer: Renderer2, private el: ElementRef) {}

//   ngOnInit(): void {
//     this.client = Binance();
//     this.ws = this.client.ws;
//     this.subscribeToTickerUpdates();
//     this.getTickerInfo();
//   }

//   ngAfterViewInit(): void {
//     this.createTradingViewWidget();
//   }

//   async getTickerInfo() {
//     const ticker = await this.client.prices();
//     console.log(ticker);
//   }

//   subscribeToTickerUpdates() {
//     this.ws.ticker('BNBBTC', (ticker: any) => {
//       console.log(ticker);
//     });
//   }

//   createTradingViewWidget() {
//     const container = document.getElementById('container');
//     if (container) {
//       new TradingView.widget({
//         container_id: container.id,
//         autosize: true,
//         symbol: 'BINANCE:BTCUSDT',
//         timezone: 'Etc/UTC',
//         theme: 'dark',
//         style: '1',
//         locale: 'en',
//         withdateranges: true,
//         range: 'YTD',
//         hide_side_toolbar: false,
//         allow_symbol_change: true,
//         watchlist: ['BINANCE:BTCUSDT'],
//         details: true,
//         hotlist: true,
//         calendar: false,
//         studies: ['STD;Balance%1of%1Power'],
//         support_host: 'https://www.tradingview.com',
//       });
//     } else {
//       console.error('Could not find container element');
//     }
//   }
// }
