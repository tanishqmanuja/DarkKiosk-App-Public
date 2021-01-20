import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeaturesPage } from './features.page';

import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatButtonModule,
  ],
  declarations: [FeaturesPage],
  entryComponents: [FeaturesPage]
})
export class FeaturesPageModule {}
