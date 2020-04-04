import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader, TranslatePipe } from '@ngx-translate/core';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { DocumentViewer, DocumentViewerOriginal } from '@ionic-native/document-viewer';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { NgCalendarModule } from 'ionic2-calendar';
import { EventdetailPage } from './pages/eventdetail/eventdetail.page';
import { FormBuilder, FormGroup, Validators, FormControl, FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import { EditeventPage } from './pages/editevent/editevent.page';
import { NavController } from '@ionic/angular';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
  }
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
  HttpClientModule,
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [HttpClient]
    }
 }), NgCalendarModule, FormsModule, ReactiveFormsModule
],
exports: [
  TranslateModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    File,
    FileOpener,
    SQLite, SQLitePorter, EventdetailPage, EditeventPage, FormBuilder, NavController
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
