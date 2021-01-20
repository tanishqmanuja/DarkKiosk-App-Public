import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleEditorPageRoutingModule } from './schedule-editor-routing.module';

import { ScheduleEditorPage } from './schedule-editor.page';
import { EditPageModule } from './edit/edit.module';

import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleEditorPageRoutingModule,
    EditPageModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [ScheduleEditorPage],
  entryComponents: [ScheduleEditorPage]
})
export class ScheduleEditorPageModule {}
