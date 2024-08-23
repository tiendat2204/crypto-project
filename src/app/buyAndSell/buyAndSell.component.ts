import { Component, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import IndicatorsAll from 'highcharts/indicators/indicators-all';
import StockTools from 'highcharts/modules/stock-tools';
import Binance from 'binance-api-node';

IndicatorsAll(Highcharts);
StockTools(Highcharts);

@Component({
  selector: 'highcharts-chart',
  templateUrl: './buyAndSell.component.html',
  styleUrls: ['./buyAndSell.component.css'],
})
export class BuyAndSellComponent implements OnInit, OnDestroy {
  private client: any;
  private ohlc: any[] = [];
  private volume: any[] = [];
  private previousCandleClose = 0;
  private ws!: WebSocket;
  private chart: any;

  constructor() {}

  ngOnInit(): void {
    this.client = Binance();

    this.fetchInitialData();

    this.initializeWebSocket();
  }

  ngOnDestroy(): void {
    if (this.ws) {
      this.ws.close();
    }
  }

  async fetchInitialData(): Promise<void> {
    const binanceData = await this.client.candles({
      symbol: 'BTCUSDT',
      interval: '1m',
    });

    const ohlc = [],
      volume = [],
      dataLength = binanceData.length;

    let previousCandleClose = 0;
    for (let i = 0; i < dataLength; i++) {
      const { openTime, open, high, low, close, volume: vol } = binanceData[i];

      ohlc.push([
        openTime, // the date
        parseFloat(open), // open
        parseFloat(high), // high
        parseFloat(low), // low
        parseFloat(close), // close
      ]);

      volume.push({
        x: openTime, // the date
        y: parseFloat(vol), // the volume
        color: parseFloat(close) > previousCandleClose ? '#466742' : '#a23f43',
        labelColor: parseFloat(close) > previousCandleClose ? '#51a958' : '#ea3d3d',
      });
      previousCandleClose = parseFloat(close);
    }

    this.ohlc = ohlc;
    this.volume = volume;
    this.previousCandleClose = previousCandleClose;

    this.initializeChart();
  }

  initializeWebSocket(): void {
    this.ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const kline = message.k;

      const newCandle = [
        kline.t, // open time
        parseFloat(kline.o), // open
        parseFloat(kline.h), // high
        parseFloat(kline.l), // low
        parseFloat(kline.c), // close
      ];

      const newVolume = {
        x: kline.t, // the date
        y: parseFloat(kline.v), // the volume
        color: parseFloat(kline.c) > this.previousCandleClose ? '#466742' : '#a23f43',
        labelColor: parseFloat(kline.c) > this.previousCandleClose ? '#51a958' : '#ea3d3d',
      };

      this.previousCandleClose = parseFloat(kline.c);

      this.updateChart(newCandle, newVolume);
    };
  }

  initializeChart(): void {
    Highcharts.setOptions({
      chart: {
        backgroundColor: '#0a0a0a',
      },
      title: {
        style: {
          color: '#cccccc',
        },
      },
      xAxis: {
        gridLineColor: '#181816',
        labels: {
          style: {
            color: '#9d9da2',
          },
        },
      },
      yAxis: {
        gridLineColor: '#181816',
        labels: {
          style: {
            color: '#9d9da2',
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        style: {
          color: '#cdcdc9',
        },
      },
      scrollbar: {
        barBackgroundColor: '#464646',
        barBorderRadius: 0,
        barBorderWidth: 0,
        buttonBorderWidth: 0,
        buttonArrowColor: '#cccccc',
        rifleColor: '#cccccc',
        trackBackgroundColor: '#121211',
        trackBorderRadius: 0,
        trackBorderWidth: 1,
        trackBorderColor: '#464646',
      },
      exporting: {
        buttons: {
          contextButton: {
            theme: {
              fill: '#121211',
            },
          },
        },
      },
    });

    this.chart = Highcharts.stockChart('container', {
      rangeSelector: {
        verticalAlign: 'top',
        x: 0,
        y: 0,
      },
      navigation: {
        bindingsClassName: 'tools-container' // informs Stock Tools where to look for HTML elements for adding technical indicators, annotations etc.
    },
      navigator: {
        enabled: true,
      },

      title: {
        text: 'Candlestick and Volume',
      },

      plotOptions: {
        series: {
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: false,
              },
            },
          },
        },
        candlestick: {
          color: '#ea3d3d',
          upColor: '#51a958',
          upLineColor: '#51a958',
          lineColor: '#ea3d3d',
        },
      },

      xAxis: {
        gridLineWidth: 1,
        crosshair: {
          snap: true,
        },
      },

      yAxis: [
        {
          height: '70%',
          crosshair: {
            snap: false,
          },
          accessibility: {
            description: 'price',
          },
        },
        {
          top: '70%',
          height: '30%',
          accessibility: {
            description: 'volume',
          },
        },
      ],

      tooltip: {
        shared: true,
        split: false,
        useHTML: true,
        shadow: false,
        positioner: function () {
          return { x: 50, y: 10 };
        },
      },

      stockTools: {
        gui: {
          enabled: true,
        },
      },

      series: [
        {
          type: 'candlestick',
          id: 'btc',
          name: 'BTCUSDT',
          data: this.ohlc,
          tooltip: {
            valueDecimals: 2,
            pointFormat:
              '<b>O</b> <span style="color: {point.color}">' +
              '{point.open} </span>' +
              '<b>H</b> <span style="color: {point.color}">' +
              '{point.high}</span><br/>' +
              '<b>L</b> <span style="color: {point.color}">{point.low} ' +
              '</span>' +
              '<b>C</b> <span style="color: {point.color}">' +
              '{point.close}</span><br/>',
          },
        },
        {
          type: 'column',
          name: 'Volume',
          data: this.volume,
          yAxis: 1,
          borderRadius: 0,
          groupPadding: 0,
          pointPadding: 0,
          tooltip: {
            pointFormat:
              '<b>Volume</b> <span style="color: ' +
              '{point.labelColor}">{point.y}</span><br/>',
          },
        },
        {
          type: 'ikh',
          linkedTo: 'btc',
          tooltip: {
            pointFormat: `<br/>
                  <span style="color: #666666;">IKH</span>
                  <br/>
                  tenkan sen: <span
                  style="color:{series.options.tenkanLine.styles.lineColor}">
                  {point.tenkanSen:.3f}</span><br/>' +
                  kijun sen: <span
                  style="color:{series.options.kijunLine.styles.lineColor}">
                  {point.kijunSen:.3f}</span><br/>
                  chikou span: <span
                  style="color:{series.options.chikouLine.styles.lineColor}">
                  {point.chikouSpan:.3f}</span><br/>
                  senkou span A: <span
                  style="color:{series.options.senkouSpanA.styles.lineColor}">
                  {point.senkouSpanA:.3f}</span><br/>
                  senkou span B: <span
                  style="color:{series.options.senkouSpanB.styles.lineColor}">
                  {point.senkouSpanB:.3f}</span><br/>`,
          },
          tenkanLine: {
            styles: {
              lineColor: '#12dbd1',
            },
          },
          kijunLine: {
            styles: {
              lineColor: '#de70fa',
            },
          },
          chikouLine: {
            styles: {
              lineColor: '#728efd',
            },
          },
          senkouSpanA: {
            styles: {
              lineColor: '#2ad156',
            },
          },
          senkouSpanB: {
            styles: {
              lineColor: '#fca18d',
            },
          },
          senkouSpan: {
            color: 'rgba(255, 255, 255, 0.3)',
            negativeColor: 'rgba(237, 88, 71, 0.2)',
          },
        },
      ],
    });
  }

  updateChart(newCandle: any[], newVolume: any): void {
    const series = this.chart.series;
    const ohlcSeries = series[0];
    const volumeSeries = series[1];

    ohlcSeries.addPoint(newCandle, true, true);
    volumeSeries.addPoint(newVolume, true, true);
  }
}
