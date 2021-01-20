import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleEditorPage } from './schedule-editor.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleEditorPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleEditorPageRoutingModule {}
