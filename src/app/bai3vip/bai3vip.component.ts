import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bai3vip',
  standalone: true,
  imports: [AgGridAngular, HttpClientModule],
  templateUrl: './bai3vip.component.html',
  styleUrls: ['./bai3vip.component.css']
})
export class Bai3vipComponent implements OnInit, OnDestroy {
  private websocket!: WebSocketSubject<any>;
  private websocketSubscription!: Subscription;
  private retryTimeout = 5000; // Retry after 5 seconds

  columnDefs: ColDef[] = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 0.5,
      cellRenderer: (params: any) => {
        const logo = this.coinLogos[params.value];
        return `
          <div class="coin-cell">
            <img src="${logo}" alt="${params.value}" width="20" height="20" style="margin-right: 5px;" />
            ${params.value}
          </div>
        `;
      }
    },
    { 
      field: 'price', 
      headerName: 'Price', 
      flex: 1,
      cellRenderer: (params: any) => {
        return `$${params.value}`;
      }
    },
    { 
      field: 'change', 
      headerName: 'Change', 
      flex: 1,
      cellRenderer: (params: any) => {
        const changeValue = parseFloat(params.value);
        const formattedChangeValue = changeValue.toFixed(2);
        const changeColor = changeValue >= 0 ? '#0ECB81' : '#F6465D';
        const changeSign = changeValue >= 0 ? '+' : '';
        return `<span style="color: ${changeColor}">${changeSign}${formattedChangeValue}%</span>`;
      }
    },
    { 
      field: '24hVolume', 
      headerName: '24h Volume', 
      flex: 1,
      cellRenderer: (params: any) => {
        return `$${params.value}`;
      }
    },
    { 
      field: 'marketCap', 
      headerName: 'Market Cap', 
      flex: 1,
      cellRenderer: (params: any) => {
        return `$${params.value}`;
      }
    }
  ];

  rowData: any[] = [];
  coinLogos: any = {};

  constructor(private http: HttpClient) {
    this.connectWebSocket();
  }

  ngOnInit() {
    this.fetchCoinLogos();
    this.subscribeToWebSocket();
  }

  fetchCoinLogos() {
    this.http.get<any>('https://min-api.cryptocompare.com/data/all/coinlist').subscribe(data => {
      const coins = data.Data;
      for (const coin in coins) {
        this.coinLogos[coin] = `https://www.cryptocompare.com${coins[coin].ImageUrl}`;
      }
    });
  }

  connectWebSocket() {
    this.websocket = webSocket('wss://streamer.cryptocompare.com/v2?api_key=7277b554fdc583c7035157ebef925753e30fd85caf00804bfaea7f1b239a61b8');
    this.subscribeToWebSocket();
  }

  subscribeToWebSocket() {
    this.websocketSubscription = this.websocket.subscribe(
      msg => this.handleWebSocketMessage(msg),
      err => this.handleWebSocketError(err),
      () => this.handleWebSocketClose()
    );

    // Subscribing to channels for BTC, ETH, LTC
    const subscriptionMessage = {
      action: 'SubAdd',
      subs: [
        '5~CCCAGG~BTC~USD',
        '5~CCCAGG~ETH~USD',
        '5~CCCAGG~LTC~USD',
        '5~CCCAGG~XRP~USD',
        '5~CCCAGG~BCH~USD',
        '5~CCCAGG~ADA~USD',
        '5~CCCAGG~DOT~USD',
        '5~CCCAGG~LINK~USD',
        '5~CCCAGG~BNB~USD',
        '5~CCCAGG~DOGE~USD',
        '5~CCCAGG~UNI~USD',
        '5~CCCAGG~XLM~USD',
        '5~CCCAGG~EOS~USD',
        '5~CCCAGG~XTZ~USD',
        '5~CCCAGG~XMR~USD',
        '5~CCCAGG~TRX~USD',
        '5~CCCAGG~USDT~USD',
        '5~CCCAGG~VET~USD',
        '5~CCCAGG~THETA~USD',
        '5~CCCAGG~ATOM~USD',
        '5~CCCAGG~AAVE~USD',
        '5~CCCAGG~SOL~USD',
        '5~CCCAGG~MKR~USD',
        '5~CCCAGG~COMP~USD',
        '5~CCCAGG~SNX~USD',
        '5~CCCAGG~YFI~USD',
        '5~CCCAGG~BAT~USD',
        '5~CCCAGG~REN~USD',
        '5~CCCAGG~GRT~USD',
        '5~CCCAGG~ENJ~USD',
        '5~CCCAGG~CRV~USD',
      ]
    
    };
    this.websocket.next(subscriptionMessage);
  }

  handleWebSocketMessage(msg: any) {
    if (msg.TYPE === '5') {  
      const currentPrice = msg.PRICE || 0; // Giá hiện tại
      const lastHourVolumeWeightedPrice = (msg.VOLUMEHOURTO / msg.VOLUMEHOUR) || 0; 
      const change = ((currentPrice - lastHourVolumeWeightedPrice) / lastHourVolumeWeightedPrice) * 100; 
      
      // Calculate the percentage change
      console.log("WebSocket message:", msg);

      const data = {
        name: msg.FROMSYMBOL,
        price: currentPrice.toLocaleString(),
        change: change.toFixed(3), // Format to 2 decimal places
        '24hVolume': msg.VOLUME24HOUR ? (msg.VOLUME24HOUR / 1e6).toFixed(6) + 'B' : '0', 
        'marketCap': msg.CURRENTSUPPLYMKTCAP ? (msg.CURRENTSUPPLYMKTCAP / 1e9).toFixed(3) + 'B' : '0', 
        logo: this.coinLogos[msg.FROMSYMBOL] || '' // Get the logo URL
      };
    
      const existingCoinIndex = this.rowData.findIndex(coin => coin.name === data.name);
      if (existingCoinIndex > -1) {
        this.rowData[existingCoinIndex] = data;
      } else {
        this.rowData.push(data);
      }
      this.rowData = [...this.rowData]; // Trigger change detection
    }
    
  }
  

  handleWebSocketError(err: any) {
    console.error('WebSocket error:', err);
    this.retryConnection();
  }

  handleWebSocketClose() {
    console.log('WebSocket connection closed');
    this.retryConnection();
  }

  retryConnection() {
    setTimeout(() => {
      console.log('Retrying WebSocket connection...');
      this.connectWebSocket();
    }, this.retryTimeout);
  }

  ngOnDestroy() {
    if (this.websocketSubscription) {
      this.websocketSubscription.unsubscribe();
    }
    this.websocket.complete();
  }
}
