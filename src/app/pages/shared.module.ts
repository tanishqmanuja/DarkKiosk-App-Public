import { NgModule } from '@angular/core'
import { AnimateItemsDirective } from '../directives/animate-items.directive';

@NgModule({
    declarations: [AnimateItemsDirective],
    exports: [AnimateItemsDirective]
})
export class SharedModule{}