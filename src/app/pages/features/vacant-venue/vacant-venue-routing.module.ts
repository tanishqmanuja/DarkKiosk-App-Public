import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VacantVenuePage } from './vacant-venue.page';

const routes: Routes = [
  {
    path: '',
    component: VacantVenuePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VacantVenuePageRoutingModule {}
