import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VacantVenuePageRoutingModule } from './vacant-venue-routing.module';

import { VacantVenuePage } from './vacant-venue.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VacantVenuePageRoutingModule
  ],
  declarations: [VacantVenuePage]
})
export class VacantVenuePageModule {}
