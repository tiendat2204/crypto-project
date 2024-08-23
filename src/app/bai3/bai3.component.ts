import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import Binance from 'binance-api-node';
import { WebSocketSubject } from 'rxjs/webSocket';

@Component({
  selector: 'app-bai3',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './bai3.component.html',
  styleUrls: ['./bai3.component.css']
})
export class Bai3Component implements OnInit, OnDestroy {
  private client = Binance();
  public marketsOverview: any[] = [];
  public tickerData: any = {};
  private tickerSocket!: WebSocketSubject<any>;

  constructor(private http: HttpClient) { }

  async ngOnInit() {
    try {
      const exchangeInfo = await this.client.exchangeInfo();
      this.marketsOverview = exchangeInfo.symbols.slice(0, 50);

      // Fetch initial ticker data
      const tickers24hr = await Promise.all(
        this.marketsOverview.map(async (market) => {
          const ticker = await this.client.dailyStats({ symbol: market.symbol });
          return { ...ticker, symbol: market.symbol };
        })
      );

      this.tickerData = tickers24hr.reduce((acc: any, ticker: any) => {
        acc[ticker.symbol] = ticker;
        return acc;
      }, {});

      // Setup WebSocket
      this.tickerSocket = new WebSocketSubject('wss://stream.binance.com:9443/ws/!ticker@arr');
      this.tickerSocket.subscribe(
        (message: any) => this.updateTickerData(message),
        (error: any) => console.error('WebSocket error:', error)
      );
    } catch (error) {
      console.error('Error fetching data from Binance API', error);
    }
  }

  ngOnDestroy() {
    if (this.tickerSocket) {
      this.tickerSocket.unsubscribe();
    }
  }

  updateTickerData(message: any) {
    message.forEach((ticker: any) => {
      if (this.tickerData[ticker.s]) {
        this.tickerData[ticker.s] = {
          ...this.tickerData[ticker.s],
          lastPrice: ticker.c,
          priceChangePercent: ticker.P,
          quoteVolume: ticker.q,
          weightedAvgPrice: ticker.w,
        };
      }
    });
  }
  getPriceChangeClass(symbol: string) {
    const ticker = this.getTicker(symbol);
    if (!ticker) {
      return '';
    }
    if (ticker.priceChangePercent < 0) {
      return 'text-danger';
    }
    if (ticker.priceChangePercent >= 0) {
      return 'text-success';
    }
    return '';
  }
  getTicker(symbol: string) {
    return this.tickerData[symbol] || {};
  }

  getLogoUrl(symbol: string): string {
    const baseAsset = symbol.split('USDT')[0].toLowerCase();
    return `https://cryptologos.cc/logos/${baseAsset}-${baseAsset}-logo.png`;
  }
}
