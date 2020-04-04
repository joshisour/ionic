import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false,
    amount: '',
    allowance: ''
  };
  minDate = new Date().toISOString();
  eventSource = [];
  viewTitle;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };
  eventarray = [];
  date: string;
  pdf = null;

  /// For translations
  param = {value: 'Sourabh'};
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  constructor(private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string,
              private translate: TranslateService, private file: File, private fileopen: FileOpener ) {
   // translate.getDefaultLang();
   translate.setDefaultLang('en');
   translate.use('mar');
  // to use the translate service
  // this.translate.get('Hello', {value: 'Sourabh'}).subscribe((res: string) => {
  // console.log(res);
    // 'Hello Dayana'
// });
   }



// tslint:disable-next-line: use-life-cycle-interface
  ngOnInit() {
    this.resetEvent();
  }

  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false,
      amount: '',
      allowance: ''
    };
  }

 // Add an event
   addEvent() {
    const newevent = {
      title: this.event.title,
      startTime:  new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc,
      amount: this.event.amount,
      allowance: this.event.allowance,
       };

    if (newevent.allDay) {
      const start = newevent.startTime;
      const end = newevent.endTime;
      newevent.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      newevent.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }
    this.eventSource.push(newevent);
    // this.myCal.loadEvents();
    // this.resetEvent();
    // console.log (this.eventSource);
  }
  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
   onTimeSelected(ev) {
  const selected = new Date(ev.selectedTime);
  this.event.startTime = selected.toISOString();
  selected.setHours(selected.getHours() + 1);
  this.event.endTime = (selected.toISOString());
   // const selected = new Date(ev.selectedTime);
   // console.log(selected);
   // console.log(ev.selectedTime.getUTCDate);
   // console.log('test');
   // console.log(this.eventSource);
  }
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    const start = formatDate(event.startTime, 'medium', this.locale);
    const end = formatDate(event.endTime, 'medium', this.locale);
    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }

  displayEvent() {
    this.eventarray = this.eventSource;
    console.log(this.eventSource);
    console.log(this.event.startTime);


  }
  createpdf() {
    pdfmake.vfs = pdfFonts.pdfMake.vfs;
    pdfmake.fonts = {
      mangal: {
        normal: 'mangal.ttf',
        bold: 'mangalb.ttf',
      }
    };
    const docDefinition = {
      content: [
        { text: 'EVENTS', style: 'header' },
        { text: 'TITLE', style: 'subheader', alignment: 'left' },
        { text: this.event.title },
        { text: 'DESCRIPTION', style: 'subheader', alignment: 'center' },
        { text: this.event.desc },
        { text: 'STARTTIME', style: 'subheader', alignment: 'center'},
        { text: this.event.startTime },
        { text: 'ENDTIME', style: 'subheader', alignment: 'center'},
        { text: this.event.endTime },
        { text: 'ENTIREDAY', style: 'subheader', alignment: 'center'},
        { text: this.event.allDay },
        { text: 'AMOUNT', style: 'subheader', alignment: 'center'},
        { text: this.event.amount },
        { text: 'ALLOWANCE', style: 'subheader', alignment: 'right'},
        { text: this.event.allowance }
      ],
      defaultStyle: {
        font: 'mangal'
      },
        // { text: 'To', style: 'subheader' },
        // this.letterObj.to,
        // { text: this.letterObj.text, style: 'story', margin: [0, 20, 0, 20] },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        story: {
          italic: true,
          alignment: 'center',
          width: '50%',
        }
      }
    };
    this.pdf = pdfmake.createPdf(docDefinition).open();
    console.log('--------' + this.pdf);
    console.log(this.event.title);

  }
  downloadpdf() {

  }

  utctolocal() {
    const local = new Date();
    const utc = moment.utc(local).format('YYYY-MM-DD HH:mm:ss');
    console.log(utc);
    console.log(moment.utc(utc).local().format('YYYY-MM-DD HH:mm:ss'));
  }

}


