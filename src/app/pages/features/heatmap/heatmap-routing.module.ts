import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeatmapPage } from './heatmap.page';

const routes: Routes = [
  {
    path: '',
    component: HeatmapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeatmapPageRoutingModule {}
