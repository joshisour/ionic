import { Injectable } from '@angular/core';
import { Event } from '../pages/calender/calender.model';
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController, Platform } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer';
import * as moment from 'moment';
import { DatabaseService } from './database.service';
import { delay } from 'q';
import { Observable, BehaviorSubject } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  flag: BehaviorSubject<boolean> = new BehaviorSubject(true);
  alertflag = true;
  pdfobj = null;
  length = 0;
  reportstart = '';
  reportend = '';
  name = '';
  type = '';
  body = [];
  lang = '';
  defaultStyle = '';
  loading;
  constructor(private file: File, private fileopen: FileOpener,
              // tslint:disable-next-line: max-line-length
              private database: DatabaseService, private plt: Platform, private alrt: AlertController,
              private translate: TranslateService, private load: LoadingController) { }
  pdfdbarray: Event[] = [];
  pdfarray: Event[] = [
    {
      eventid: 1,
      empid: 1,
      title: 'testpdf',
      desc: 'test',
      starttime: '2019-07-26 00:00:00',
      endtime: '2019-07-26 01:00:00',
      date: '2019-07-26 00:00:00',
      ta: 100,
      da: 100,
      poa: 'sangli',
      pod: 'kolhapur',
      absent_hrs: '4.5'
    },
    {
      eventid: 1,
      empid: 1,
      title: 'testpdf',
      desc: 'test',
      starttime: '2019-07-26 00:00:00',
      endtime: '2019-07-26 01:00:00',
      date: '2019-07-26 00:00:00',
      ta: 100,
      da: 100,
      poa: 'sangli',
      pod: 'kolhapur',
      absent_hrs: '4.5'
    }
  ];
  pdfevent: Event = {} as Event;

gettableformat(start, end) {
  this.reportstart = moment.utc(start).format('YYYY-MM-DD');
  this.reportend = moment.utc(end).format('YYYY-MM-DD');
  const offset = moment(this.reportstart).utcOffset();
  console.log(offset);
  this.reportstart = moment(this.reportstart).format('YYYY-MM-DD 00:00:00');
  this.reportend = moment(this.reportend).format('YYYY-MM-DD 23:59:59');
  if (offset < 0) {
      this.reportstart = moment.utc(this.reportstart).subtract(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      this.reportend = moment.utc(this.reportend).subtract(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    } else {
      this.reportstart = moment.utc(this.reportstart).add(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      this.reportend = moment.utc(this.reportend).add(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    }
  this.type = 'Monthly';
  }
genreport(start, end, name) {
this.loadingpresent();
this.name = name;
this.gettableformat(start, end);
this.getdbarray().subscribe(flag => {
   console.log('the value of flag after subscribing is' + flag);
   console.log('the subscribing way has pdfdbarray length as ' + this.pdfdbarray.length);
   if (this.pdfdbarray.length > 0) {
    this.body = this.buildTableBody();
    while (this.body.length === 1) {
      console.log('in the while loop with the body');
      this.body = [];
      this.delay(100);
      this.body = this.buildTableBody();
   }
    console.log('outside the while loop' + this.body.length);
    this.loadingdismiss();
    this.createpdf();
 } else if (this.pdfdbarray.length === 0 && this.alertflag !== flag) {
   console.log('this.alertflag and this.flag is' + this.alertflag + flag);
   this.loadingdismiss();
   this.onresult();
 }
});
}

createpdf() {
  pdfmake.vfs = pdfFonts.pdfMake.vfs;
  if (this.lang === 'mar') {
    pdfmake.fonts = {
      mangal: {
        normal: 'mangal.ttf',
        bold: 'mangalb.ttf',
        italics: 'mangal.ttf',
        bolditalics: 'mangalb.ttf'
      }
    };
    this.defaultStyle = 'mangal' ;
  } else {
    pdfmake.fonts = {
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Regular.ttf',
        bolditalics: 'Roboto-Medium.ttf'
      }
    };
    this.defaultStyle = 'Roboto';
  }
  const from = moment.utc(this.reportstart).local().format('YYYY-MM-DD');
  const to = moment.utc(this.reportend).local().format('YYYY-MM-DD');
  const docDefinition = {
    content: [ {text: `${this.type} Report from ${from} to ${to} for ${this.name}`, style: 'Header'},
               this.table()
    ],
    defaultStyle: {
      font: this.defaultStyle
    },
  };
  this.pdfobj = pdfmake.createPdf(docDefinition);
  const today = moment(Date.now()).format('MMDDYYYY_HHmmss');
 // pdfmake.createPdf(docDefinition).open();
 // pdfmake.createPdf(docDefinition).download('optionalName.pdf');
 // steps needed to download and open the file since open() works with the browser only.
  if (this.plt.is('cordova')) {
    this.pdfobj.getBuffer((buffer) => {
      const utf8 = new Uint8Array(buffer);
      const binaryArray = utf8.buffer;
      const blob = new Blob ([binaryArray as BlobPart], {type: 'application/pdf'});
      this.file.writeFile(this.file.dataDirectory, `Report_${today}.pdf`, blob, {replace: true}).
    then(fileentry =>  { this.fileopen.open(this.file.dataDirectory + `Report_${today}.pdf`, 'application/pdf');
  });
  });
} else {
this.pdfobj.download();
}

}
async onresult() {
  const alert = await this.alrt.create({
  header: 'Alert',
  subHeader: '0 Results found for the selected date range',
  message: 'Please click Ok to generate a new PDF with different date range',
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

async loadingpresent() {
  this.loading = await this.load.create({
    spinner: null,
    duration: 10000,
    message: 'Please wait...',
    translucent: true,
    cssClass: 'custom-class custom-loading'
  });
  // return await loading.present();
  this.loading.present();
}
loadingdismiss() {
  this.loading.dismiss();
}

async delay(ms: number) {
  await new Promise(resolve => setTimeout(() => resolve(), ms)).then(() => console.log('fired'));
}
async getdbarraynew() {
  this.pdfarray = [];
  this.pdfdbarray = [];
  let flag = 'true';
  console.log('in the db array the start and end are ' + this.reportstart + this.reportend);
  await this.database.geteventsbyrange(this.reportstart, this.reportend)
   .then(data => { // tslint:disable-next-line: forin
                   for (const property in data) {
                    console.log(property + '=' + data[property]);
                  }
                   if (Object.keys(data).length === 0) {
                    console.log('No events found for the selected date range.');
                    flag = 'false';
                  } else if (Object.keys(data).length > 0) {
                   for (let i = 0; i < Object.keys(data).length; i++) {
                     const event: Event = {} as Event;
                     event.eventid = data[i].eventid;
                     event.empid = data[i].empid;
                     event.date = data[i].date;
                     event.title = data[i].title;
                     event.desc = data[i].desc;
                     event.starttime = moment.utc(data[i].starttime).local().format('YYYY-MM-DD HH:mm:ss');
                     event.endtime = moment.utc(data[i].endtime).local().format('YYYY-MM-DD HH:mm:ss');
                     console.log('event.starttime and event.endtime is' + event.starttime + event.endtime);
                     event.ta = data[i].ta;
                     event.da = data[i].da;
                     event.absent_hrs = data[i].absent_hrs;
                     event.poa = data[i].poa;
                     event.pod = data[i].pod;
                     this.pdfdbarray.push(event);
                   }
             } else {
                throw new Error('DB query failed');
             }

});
  return flag;
}

table() {
    return {
            style: 'tableExample',
            color: '#444',
            table: {
            headerRows: 1,
            widths: [ 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
            body: this.body
        }
    };
  }
buildTableBody() {
    // tslint:disable-next-line: max-line-length
    const columns = [{text: 'Title', style: 'tableHeader'}, {text: 'Description', style: 'tableHeader'}, {text: 'Starttime', style: 'table'},
    {text: 'Endtime', style: 'tableHeader'}, {text: 'Travel Allowance', style: 'tableHeader'},
    {text: 'Daily Allowance', style: 'tableHeader'},  {text: 'Absent(in Hours)', style: 'tableHeader'},
    {text: 'Place of Arrival', style: 'tableHeader'}, {text: 'Place of Departure', style: 'tableHeader'}];
    const rows = [this.pdfevent.title, this.pdfevent.desc, this.pdfevent.starttime, this.pdfevent.endtime, this.pdfevent.ta,
      this.pdfevent.da, this.pdfevent.absent_hrs, this.pdfevent.poa, this.pdfevent.pod];
    const array = [];
    const body = [];
    body.push(columns);
    console.log(this.pdfdbarray.length + 'length od db array');
          // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.pdfdbarray.length; i++) {
      console.log('in the for loop');
      // tslint:disable-next-line: max-line-length
      body.push([this.pdfdbarray[i].title, this.pdfdbarray[i].desc, this.pdfdbarray[i].starttime, this.pdfdbarray[i].endtime, this.pdfdbarray[i].ta,
    this.pdfdbarray[i].da, this.pdfdbarray[i].absent_hrs, this.pdfdbarray[i].poa, this.pdfdbarray[i].pod]);
      console.log('the indi starttimes are' + this.pdfarray[i].starttime);
   }
    return body;
  }
getdbarray() {
  this.pdfarray = [];
  this.pdfdbarray = [];
  // console.log('in the db array the start and end are ' + this.reportstart + this.reportend);
  this.database.geteventsbyrange_new(this.reportstart, this.reportend)
   .then(data => { // tslint:disable-next-line: forin
                   for (const property in data) {
                    console.log(property + '=' + data[property]);
                  }
                   if (Object.keys(data).length === 0) {
                    console.log('No events found for the selected date range.');
                    this.flag.next(false);
                    this.alertflag = false;
                  } else if (Object.keys(data).length > 0) {
                   for (let i = 0; i < Object.keys(data).length; i++) {
                     const event: Event = {} as Event;
                     event.eventid = data[i].eventid;
                     event.empid = data[i].empid;
                     event.date = data[i].date;
                     event.title = data[i].title;
                     event.desc = data[i].desc;
                     event.starttime = moment.utc(data[i].starttime).local().format('YYYY-MM-DD HH:mm:ss');
                     event.endtime = moment.utc(data[i].endtime).local().format('YYYY-MM-DD HH:mm:ss');
                     console.log('event.starttime and event.endtime is' + event.starttime + event.endtime);
                     event.ta = data[i].ta;
                     event.da = data[i].da;
                     event.absent_hrs = data[i].absent_hrs;
                     event.poa = data[i].poa;
                     event.pod = data[i].pod;
                     this.pdfarray.push(event);
                     this.pdfdbarray.push(event);
                   }
                   this.flag.next(true);
             } else {
                throw new Error('DB query failed');
             }

});
  return this.flag;
}
/*
saveandopen() {
  if (this.plt.is('cordova')) {
    this.pdf.getBuffer((buffer) => {
      const utf8 = new Uint8Array(buffer);
      const binaryArray = utf8.buffer;
      const blob = new Blob ([binaryArray as BlobPart], {type: 'application/pdf'});
      this.file.writeFile(this.file.dataDirectory, 'Report.pdf', blob, { replace: true}).
      then(fileentry =>  { this.fileopen.open(this.file.dataDirectory + 'Report.pdf', 'application/pdf');
    });
    });
} else {
  this.pdf.download();
}
}
*/


}
