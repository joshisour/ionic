import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { createTranslateLoader } from '../../app.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { EventdetailPage } from './eventdetail.page';

const routes: Routes = [
  {
    path: '',
    component: EventdetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
    })
  ],
  declarations: [EventdetailPage]
})
export class EventdetailPageModule {}
