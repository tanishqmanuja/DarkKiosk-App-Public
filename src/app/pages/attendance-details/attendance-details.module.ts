import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { AttendanceDetailsPage } from './attendance-details.page';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MatListModule } from '@angular/material/list';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgCircleProgressModule,
    MatListModule
  ],
  declarations: [AttendanceDetailsPage],
  entryComponents: [AttendanceDetailsPage]
})
export class AttendanceDetailsPageModule {}
