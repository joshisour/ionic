import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';
import { DocumentViewerOptions } from '@ionic-native/document-viewer';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-testreport',
  templateUrl: './testreport.page.html',
  styleUrls: ['./testreport.page.scss'],
})
export class TestreportPage implements OnInit {
  reportstart = '';
  reportend = '';
  name = '';
  lang = '';
  constructor(private report: ReportsService, private translate: TranslateService,
              private alrt: AlertController) {
  this.lang = this.report.lang;
  translate.setDefaultLang('en');
  translate.use(this.lang);
   }

  ngOnInit() {
  }
 genreport() {
   // const repstart = moment(this.reportstart).format('DD');
   // const repend = moment(this.reportend).format('DD');
   console.log(this.reportend + this.reportstart);
   if (this.reportstart && this.reportend) {
   const flag = moment(this.reportend).isBefore(this.reportstart);
   if (flag) {
     this.alertondate();
   } else {
   // this.report.getdbarray(this.reportstart, this.reportend);
  this.report.genreport(this.reportstart, this.reportend, this.name);
   }
  } else {
    this.blankalert();
  }
 }
 openlocal() {}
 downloadlocal() {}
 async alertondate() {
  const alert = await this.alrt.create({
    header: 'Error',
    message: 'End date cannot occur before the start date of report. Please select a different start date and end date.',
    buttons: [
      {
        text: 'Ok',
        cssClass: 'secondary',
        handler: () => {
          console.log('Confirm Ok');
        }
      }
    ]
  });
  await alert.present();
  }

  async blankalert() {
    const alert = await this.alrt.create({
      header: 'Error',
      message: 'Start date and End date cannot be blank.',
      buttons: [
        {
          text: 'Ok',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });
    await alert.present();
    }
}
