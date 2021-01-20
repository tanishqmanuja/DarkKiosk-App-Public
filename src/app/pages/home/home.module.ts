import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomePage } from './home.page';
import { SuperTabsModule } from '@ionic-super-tabs/angular';
import { DashboardPageModule } from '../dashboard/dashboard.module';
import { AttendancePageModule } from '../attendance/attendance.module';
import { SchedulePageModule } from '../schedule/schedule.module';
import { ReportsPageModule } from '../reports/reports.module';
import { FeaturesPageModule } from '../features/features.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    SuperTabsModule,
    DashboardPageModule,
    AttendancePageModule,
    ReportsPageModule,
    SchedulePageModule,
    FeaturesPageModule,
  ],
  declarations: [HomePage]
})
export class HomePageModule {}