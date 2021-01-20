import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeeDetailsPageRoutingModule } from './fee-details-routing.module';

import { FeeDetailsPage } from './fee-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeeDetailsPageRoutingModule
  ],
  declarations: [FeeDetailsPage]
})
export class FeeDetailsPageModule {}
