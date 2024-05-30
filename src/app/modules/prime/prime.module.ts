import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DividerModule } from 'primeng/divider';
import { ToggleButtonModule } from 'primeng/togglebutton';


@NgModule({
  exports: [
    ButtonModule,
    DropdownModule,
    SelectButtonModule,
    DividerModule,
    ToggleButtonModule,
  ]
})
export class PrimeModule { }
