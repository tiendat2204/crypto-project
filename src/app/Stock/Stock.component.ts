// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-Stock',
//   templateUrl: './Stock.component.html',
//   styleUrls: ['./Stock.component.css']
// })
// export class StockComponent implements OnInit {
//   symbolsGroups = [
//     {
//       name: "Overview",
//       symbols: [
//         { name: "CRYPTOCAP:TOTAL" },
//         { name: "BITSTAMP:BTCUSD" },
//         { name: "BITSTAMP:ETHUSD" },
//         { name: "FTX:SOLUSD" },
//         { name: "BINANCE:AVAXUSD" },
//         { name: "COINBASE:UNIUSD" }
//       ]
//     },
//     {
//       name: "Bitcoin",
//       symbols: [
//         { name: "BITSTAMP:BTCUSD" },
//         { name: "COINBASE:BTCEUR" },
//         { name: "COINBASE:BTCGBP" },
//         { name: "BITFLYER:BTCJPY" },
//         { name: "CME:BTC1!" }
//       ]
//     },
//     {
//       name: "Ethereum",
//       symbols: [
//         { name: "BITSTAMP:ETHUSD" },
//         { name: "KRAKEN:ETHEUR" },
//         { name: "COINBASE:ETHGBP" },
//         { name: "BITFLYER:ETHJPY" },
//         { name: "BINANCE:ETHBTC" },
//         { name: "BINANCE:ETHUSDT" }
//       ]
//     },
//     {
//       name: "Solana",
//       symbols: [
//         { name: "FTX:SOLUSD" },
//         { name: "BINANCE:SOLEUR" },
//         { name: "COINBASE:SOLGBP" },
//         { name: "BINANCE:SOLBTC" },
//         { name: "HUOBI:SOLETH" },
//         { name: "BINANCE:SOLUSDT" }
//       ]
//     },
//     {
//       name: "Uniswap",
//       symbols: [
//         { name: "COINBASE:UNIUSD" },
//         { name: "KRAKEN:UNIEUR" },
//         { name: "COINBASE:UNIGBP" },
//         { name: "BINANCE:UNIBTC" },
//         { name: "KRAKEN:UNIETH" },
//         { name: "BINANCE:UNIUSDT" }
//       ]
//     }
//   ];

//   constructor() { }

//   ngOnInit(): void {
//     this.loadTradingViewWidgetScript();
//   }

//   loadTradingViewWidgetScript() {
//     const script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
//     script.async = true;
//     script.textContent = JSON.stringify({
//       "title": "Cryptocurrencies",
//       "title_raw": "Cryptocurrencies",
//       "title_link": "/markets/cryptocurrencies/prices-all/",
//       "width": "100%",
//       "height": "1000",
//       "locale": "en",
//       "showSymbolLogo": true,
//       "symbolsGroups": this.symbolsGroups,
//       "colorTheme": "dark"
//     });
//     document.body.appendChild(script);
//   }
// }