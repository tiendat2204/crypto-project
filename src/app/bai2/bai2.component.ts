import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import Binance from 'binance-api-node';

interface Order {
  side: string;
  price: number;
  amount: number;
  total: number;
  sum: number;
}

interface Depth {
  eventType: string;
  eventTime: number;
  symbol: string;
  firstUpdateId: number;
  finalUpdateId: number;
  bidDepth: Array<{ price: string; quantity: string }>;
  askDepth: Array<{ price: string; quantity: string }>;
}

@Component({
  imports: [CommonModule, TableModule],
  standalone: true,
  selector: 'app-bai2',
  templateUrl: './bai2.component.html',
  styleUrls: ['./bai2.component.css']
})
export class Bai2Component implements OnInit {
  buyOrders: Order[] = [];
  sellOrders: Order[] = [];
  client: any;

  constructor() {
    this.client = Binance();
  }

  ngOnInit(): void {
    this.fetchOrderBook();
  }

  fetchOrderBook(): void {
    this.client.ws.depth('BTCUSDT', (depth: any) => {
      this.updateOrders(depth);
    });
  }

  updateOrders(depth: Depth): void {
    const buyOrders: Order[] = [];
    const sellOrders: Order[] = [];
    let buySum = 0;
    let sellSum = 0;

    // Log depth data to check its structure
    console.log('Depth data:', depth);

    // Process buy orders
 // Process buy orders
if (depth.bidDepth && Array.isArray(depth.bidDepth)) {
  for (const order of depth.bidDepth.slice(0, 10)) {
    const parsedPrice = parseFloat(order.price);
    const parsedAmount = parseFloat(order.quantity);
    const total = parsedPrice * parsedAmount;
    buySum += total;
    buyOrders.push({
      side: `Buy`,
      price: parsedPrice,
      amount: parsedAmount,
      total: total,
      sum: buySum
    });
  }
}

// Process sell orders
if (depth.askDepth && Array.isArray(depth.askDepth)) {
  for (const order of depth.askDepth.slice(0, 10)) {
    const parsedPrice = parseFloat(order.price);
    const parsedAmount = parseFloat(order.quantity);
    const total = parsedPrice * parsedAmount;
    sellSum += total;
    sellOrders.push({
      side: `Sell`,
      price: parsedPrice,
      amount: parsedAmount,
      total: total,
      sum: sellSum
    });
  }
}

    this.buyOrders = buyOrders;
    this.sellOrders = sellOrders;
  }
}
