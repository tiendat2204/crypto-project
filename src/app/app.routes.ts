import { Routes } from '@angular/router';
// import { HomeComponent } from './home/home.component';
// import { RealTimeTicketComponent } from './realTimeTicket/realTimeTicket.component';
import { BuyAndSellComponent } from './buyAndSell/buyAndSell.component';
// import { StockComponent } from './Stock/Stock.component';
import { Bai3Component } from './bai3/bai3.component';
import { Bai2Component } from './bai2/bai2.component';
import { Bai2vipComponent } from './bai2vip/bai2vip.component';
import { Bai3vipComponent } from './bai3vip/bai3vip.component';
import { ButtonComponent } from './button/button.component';
export const routes: Routes = [
  { path: '', component: ButtonComponent },
  { path: 'buy-sell', component: BuyAndSellComponent },
  // { path: 'real-time-ticket', component: RealTimeTicketComponent },
  // { path: 'stock', component: StockComponent },
  { path: 'bai3', component: Bai3Component },
  { path: 'bai2', component: Bai2Component },
  { path: 'bai2vip', component: Bai2vipComponent },
  { path: 'bai3vip', component: Bai3vipComponent },
];
