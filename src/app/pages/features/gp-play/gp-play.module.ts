import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GpPlayPageRoutingModule } from './gp-play-routing.module';

import { GpPlayPage } from './gp-play.page';
import { DragDropModule } from '@angular/cdk/drag-drop'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GpPlayPageRoutingModule,
    DragDropModule
  ],
  declarations: [GpPlayPage]
})
export class GpPlayPageModule {}
