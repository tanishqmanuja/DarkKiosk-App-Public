import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeeDetailsPage } from './fee-details.page';

const routes: Routes = [
  {
    path: '',
    component: FeeDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeeDetailsPageRoutingModule {}
