import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GpPlayPage } from './gp-play.page';

const routes: Routes = [
  {
    path: '',
    component: GpPlayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpPlayPageRoutingModule {}
