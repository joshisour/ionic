import { Component, OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Event } from '../calender/calender.model';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { EventdetailPage } from '../eventdetail/eventdetail.page';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-calender',
  templateUrl: './calender.page.html',
  styleUrls: ['./calender.page.scss'],
})
export class CalenderPage implements OnInit {
// tslint:disable-next-line: variable-name
  events_cal: Event[] = [];
  events: Event[] = [];
  eventsdisplay: Event[] = [];
  newevent: Event = {} as Event;
  minDate = new Date().toISOString();
  eventSource = [];
  start = '';
  end = '';
  listing = '';
  month = '';
  goffset: number;
  year = '';
  viewTitle;
  lang = '';
  calendar = {
    // queryMode: 'remote',
    mode: 'month',
    currentDate: new Date(),
    // locale: 'en-US'
  };
  eventarray = [];
  date: string;
  eventform: FormGroup;
  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  // tslint:disable-next-line: variable-name
  constructor(private dbservice: DatabaseService, public eventdet: EventdetailPage, public formbuilder: FormBuilder,
              private translate: TranslateService, private alrt: AlertController ) {
    this.lang = this.dbservice.lang;
    this.translate.setDefaultLang('en');
    this.translate.use(this.lang);
    if (this.lang === 'mar') {
    this.eventform = formbuilder.group ({
      title: ['', Validators.compose([Validators.required, Validators.maxLength(15)])],
      desc: [Validators.required],
      travel: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
      daily: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
      absent: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]\.[0-9]')])],
      poa: ['', Validators.compose([Validators.required, Validators.maxLength(15) ])],
      pod: ['', Validators.compose([Validators.required, Validators.maxLength(15)])]
    });
  } else {
    this.eventform = formbuilder.group ({
      title: ['', Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern('[a-zA-Z ]*')])],
      desc: [Validators.required],
      travel: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
      daily: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]*')])],
      absent: ['', Validators.compose([Validators.required, Validators.pattern('[0-9]\.[0-9]')])],
      poa: ['', Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern('[a-zA-Z ]*')])],
      pod: ['', Validators.compose([Validators.required, Validators.maxLength(15), Validators.pattern('[a-zA-Z ]*')])]
    });
  }

  }

  ngOnInit() {
    this.minDate = moment.utc(this.minDate).format('YYYY-01-01');
    this.dbservice.getDatabaseState().subscribe(state => {
      if (state) {
// tslint:disable-next-line: variable-name
        this.dbservice.getevents().then(event_list => {
          this.events_cal = event_list;
          console.log('returning the value');
          console.log(this.events_cal);
        });
      }
    });
  }

  onTimeSelected(ev: { selectedTime: Date }) {
    this.eventsdisplay = [];
    this.events = [];
    this.newevent.starttime = ev.selectedTime.toISOString();
    const offset = moment(this.newevent.starttime).utcOffset();
    this.goffset = offset;
    this.start = moment(this.newevent.starttime).format('YYYY-MM-DD 00:00:00');
    this.end = moment(this.newevent.starttime).format('YYYY-MM-DD 23:59:59');
    this.listing = moment.utc(this.start).format('YYYY-MM-DD');
    this.month = moment.utc(this.listing).format('MMM');
    this.year = moment.utc(this.listing).format('YYYY');
    if (offset < 0) {
      this.start = moment.utc(this.start).subtract(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      this.end = moment.utc(this.end).subtract(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    } else {
      this.start = moment.utc(this.start).add(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      this.end = moment.utc(this.end).add(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    }
    console.log(this.start);
    console.log(this.end);
    console.log('Events before DB action' + this.eventSource);
    // this.dbservice.listevents(this.newevent.starttime)
    this.dbservice.geteventsbydate_new(this.start, this.end)
    .then(data => { if (Object.keys(data).length > 0) {
                    for (let i = 0; i < Object.keys(data).length; i++) {
                      const event: Event = {} as Event;
                      console.log(data[i].eventid);
                      console.log(data[i].starttime);
                      event.eventid = data[i].eventid;
                      event.empid = data[i].empid;
                      event.date = data[i].date;
                      console.log('this date in the time selected is ' + event.date);
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
                      this.events.push(event);
                      this.eventSource.push(event);
                    }
              }
                    this.eventsdisplay = this.events;
                    // console.log('The temp array is ' + this.eventsdisplay[0].eventid);
              })
             .catch(error => { console.error(error); });



  }
 /*
 onTimeSelected(ev: { selectedTime: Date }) {
    this.eventsdisplay = [];
    this.events = [];
    this.newevent.starttime = ev.selectedTime.toISOString();
    const offset = moment(this.newevent.starttime).utcOffset();
    // this.starttime = moment(this.newevent.starttime).format('YYYY-MM-DD');
    this.newevent.starttime = moment.utc(this.newevent.starttime).format('YYYY-MM-DD');
    console.log('Events before DB action' + this.eventSource);
    // this.dbservice.listevents(this.newevent.starttime)
    this.dbservice.geteventsbydate(this.newevent.starttime)
    .then(data => { if (Object.keys(data).length > 0) {
                    for (let i = 0; i < Object.keys(data).length; i++) {
                      const event: Event = {} as Event;
                      console.log(data[i].eventid);
                      console.log(data[i].starttime);
                      event.eventid = data[i].eventid;
                      event.empid = data[i].empid;
                      event.date = data[i].date;
                      console.log('this date in the time selected is ' + event.date);
                      event.title = data[i].title;
                      event.desc = data[i].desc;
                      event.starttime = moment.utc(data[i].starttime).local().format('YYYY-MM-DD HH:mm:ss');
                      this.starttime = moment(event.starttime).format('YYYY-MM-DD');
                      event.endtime = moment.utc(data[i].endtime).local().format('YYYY-MM-DD HH:mm:ss');
                      console.log('event.starttime and event.endtime is' + event.starttime + event.endtime);
                      event.ta = data[i].ta;
                      event.da = data[i].da;
                      event.absent_hrs = data[i].absent_hrs;
                      event.poa = data[i].poa;
                      event.pod = data[i].pod;
                      this.events.push(event);
                      this.eventSource.push(event);
                    }
              }
                    this.eventsdisplay = this.events;
                    // console.log('The temp array is ' + this.eventsdisplay[0].eventid);
              })
             .catch(error => { console.error(error); });



  }
  utctolocal() {
    const local = new Date();
    const utc = moment.utc(local).format('YYYY-MM-DD HH:mm:ss');
    console.log(utc);
    console.log(moment.utc(utc).local().format('YYYY-MM-DD HH:MM:SS'));
  }
*/
async alertonevent() {
const alert = await this.alrt.create({
  header: 'Alert',
  subHeader: 'Event created successfully! ',
  message: 'You can see the created event under Event List by clicking on the date of event creation in the calender.',
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

  onViewTitleChanged() {

  }
  onEventSelected() {
  }
  listEvent() {
// tslint:disable-next-line: variable-name
    console.log('List is populated');
// tslint:disable-next-line: variable-name
    this.dbservice.getevents().then(event_list => {
      this.events_cal = event_list;
      console.log ('List is populated twice');
      console.log(this.events_cal);
    });
         }
    addEvent() {
      /*
      this.newevent.eventid = 2;
      this.newevent.empid = 1;
      this.newevent.date = '2019-07-07 07:07:07.0000';
      this.newevent.title = 'add event test';
      this.newevent.desc = 'test if add event works fine';
      this.newevent.starttime = '2019-07-07 08:00:00.0000';
      this.newevent.endtime = '2019-07-07 09:00:00.0000';
      this.newevent.ta = 100;
      this.newevent.da = 50;
      this.newevent.absent_hrs = '4';
      this.newevent.poa = 'pune';
      this.newevent.pod = 'newark';
// tslint:disable-next-line: variable-name
    this.newevent.date = new Date().toISOString();
    this.newevent.date = moment(this.newevent.date).format('YYYY-MM-DD HH:MM:SS');
    console.log('this date is ' + this.newevent.date);
    this.newevent.date = moment.utc(this.newevent.date).format('YYYY-MM-DD HH:MM:SS');
    console.log('the new UTC date is ' + this.newevent.date);
    */
   console.log('Before the conversion the start and end times are ' + this.newevent.starttime + this.newevent.endtime);
   this.newevent.starttime = moment.utc(this.newevent.starttime).format('YYYY-MM-DD HH:mm:ss');
   this.newevent.endtime = moment.utc(this.newevent.endtime).format('YYYY-MM-DD HH:mm:ss');
   console.log('the starttime and endtimes are ' + this.newevent.starttime + this.newevent.endtime);
   this.newevent.empid = 1;
   this.dbservice.addevent(this.newevent)
      .then(data => { console.log('data to be printed is ' + data);
                      if (data) {
                        console.log('Event addition is successful');
                        this.eventform.reset();
                        this.alertonevent();
                      } else {
                        throw new Error ('Event addition failed');
                      }
// tslint:disable-next-line: forin
                      })
      .catch(error => { console.error(error); });

     }


    deleteEvent() {
    const date = '2019-07-07 07:07:07.0000';
    const title = 'add event test';
    const eventid = 2 ;
    this.dbservice.deleteevent(eventid)
    .then(data => { console.log('data to be printed is ' + data);
                    if (data) {
                        console.log('Event deletion is successful');
                      } else {
                        throw new Error ('Event deletion failed');
                      }
// tslint:disable-next-line: forin
                      })
      .catch(error => { console.error(error); });
    }

     flushall() {
// tslint:disable-next-line: variable-name
       this.dbservice.flushall().then(event_list => {
         console.log(event_list);
       });
     }
     /*
    showdetails() {
      const eventid = 2 ;
      this.dbservice.geteventdetails(eventid)
    .then(data => { console.log('data to be printed is ' + data);
                    for (const property in data) {
                      console.log(property + '=' + data[property]);
                      console.log(JSON.stringify(data[property]));
                      this.newevent.eventid = data[property].eventid;
                      this.newevent.empid = data[property].empid;
                      this.newevent.date = data[property].date;
                      this.newevent.title = data[property].title;
                      this.newevent.desc = data[property].desc;
                      this.newevent.starttime = data[property].starttime;
                      this.newevent.endtime = data[property].endtime;
                      this.newevent.ta = data[property].ta;
                      this.newevent.da = data[property].da;
                      this.newevent.absent_hrs = data[property].absent_hrs;
                      this.newevent.poa = data[property].poa;
                      this.newevent.pod = data[property].pod;
                      console.log('The event details are ' + this.newevent.poa);
                    }
// tslint:disable-next-line: variable-name
/*
                    const events_arr: Event[] = [];
                    if (data.rows.length > 0) {
                          for (let i = 0; i < data.rows.length; i++) {
                            events_arr.push({
                            eventid: data.rows.item(i).eventid,
                            empid: data.rows.item(i).empid,
                            date: data.rows.item(i).date,
                            title: data.rows.item(i).title,
                            desc: data.rows.item(i).desc,
                            starttime: data.rows.item(i).starttime,
                            endtime: data.rows.item(i).endtime,
                            ta: data.rows.item(i).ta,
                            da: data.rows.item(i).da,
                            absent_hrs: data.rows.item(i).absent_hrs,
                            poa: data.rows.item(i).poa,
                            pod: data.rows.item(i).pod,
                        });
          }
        }
                    // tslint:disable-next-line: forin
                      })
      .catch(error => { console.error(error); });
    }
    */

   next() {
     // tslint:disable-next-line: no-string-literal
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }
  back() {
    // tslint:disable-next-line: no-string-literal
    const swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }

    }


