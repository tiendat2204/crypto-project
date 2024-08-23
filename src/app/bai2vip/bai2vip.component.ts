import { Component, OnInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import Binance from 'binance-api-node';

@Component({
  selector: 'app-bai2vip',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './bai2vip.component.html',
  styleUrls: ['./bai2vip.component.css'],
})
export class Bai2vipComponent implements OnInit {
  buyOrder: {
    name: string;
    price: number;
    amount: number;
    total: number;
    sum: any;
  }[] = [];
  sellOrder: {
    name: string;
    price: number;
    amount: number;
    total: number;
    sum: any;
  }[] = [];

  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
  };

  colDef: ColDef[] = [
    {
      headerName: 'Name',
      field: 'name',
      cellStyle: (params) => {
        if (params.value.startsWith('Buy Order')) {
          return { color: 'green' };
        } else if (params.value.startsWith('Sell Order')) {
          return { color: 'red' };
        }
        return null;
      },
    },
    {
      headerName: 'Price',
      field: 'price',
      valueFormatter: (params) => `${parseFloat(params.value).toFixed(3).toLocaleString()}`,
    },
    {
      headerName: 'Amount',
      field: 'amount',
      valueFormatter: (params) => {
        if (params.value < 0.000001) {
          return `${params.value.toLocaleString()}`;
        } else {
          return `${parseFloat(params.value).toFixed(6).toLocaleString()}`;
        }
      },
    },
    {
      headerName: 'Total',
      field: 'total',
      flex: 1,
      valueFormatter: (params) => `${params.value.toLocaleString()}`,
    },
    {
      headerName: 'Sum',
      field: 'sum',
      flex: 2,
      valueFormatter: (params) => `${params.value.toLocaleString()}`,
    },
  ];

  buyGridOptions: GridOptions = {
    animateRows: true,
    getRowStyle: (params: any) => {
      const totalAmount = params.data.amount;
      const ratio = totalAmount / this.buyOrder.length;
      const gradientColor = `linear-gradient(90deg, white ${
        ratio * 100
      }%, rgb(0, 197, 130, 0.15) ${ratio * 100}%)`;
  
      if (params.data.name.startsWith('Buy Order')) {
        return { background: gradientColor };
      }
      return undefined;
    },
  };
  
  sellGridOptions: GridOptions = {
    animateRows: true,
    getRowStyle: (params: any) => {
      const totalAmount = params.data.amount;
      const ratio = totalAmount / this.sellOrder.length;
      const gradientColor = `linear-gradient(90deg, white ${
        ratio * 100
      }%, rgb(255, 3, 114, 0.15)${ratio * 100}%)`;
  
      if (params.data.name.startsWith('Sell Order')) {
        return { background: gradientColor };
      }
      return undefined;
    },
  };

  constructor() {}

  ngOnInit() {
    const client = Binance();
    const ws = client.ws;

    ws.depth('BTCUSDT', (depth: any) => {
      console.log(depth);
      this.buyOrder = depth.bidDepth
      .filter((bid: any) => bid.quantity > 0)
      .map((bid: any, index: number) => ({
        name: 'Buy Order ' + (index + 1),
        price: bid.price,
        amount: bid.quantity,
        total: bid.price * bid.quantity,
        sum: 0, // Placeholder, will be calculated later
      }))
      .slice(0, 10);
    
    this.sellOrder = depth.askDepth
      .filter((ask: any) => ask.quantity > 0)
      .map((ask: any, index: number) => ({
        name: 'Sell Order ' + (index + 1),
        price: ask.price,
        amount: ask.quantity,
        total: ask.price * ask.quantity,
        sum: 0, // Placeholder, will be calculated later
      }))
      .slice(0, 10);

      this.calculateSums();
    });
  }

  calculateSums() {
    let buySum = 0;
    for (let order of this.buyOrder) {
      buySum += Number(order.amount) + Number(order.total);
      order.sum = Number(buySum.toFixed(11)).toLocaleString();
    }
  
    let sellSum = 0;
    for (let order of this.sellOrder) {
      sellSum += Number(order.amount) + Number(order.total);
      order.sum = Number(sellSum.toFixed(11)).toLocaleString();
    }
  }
}
