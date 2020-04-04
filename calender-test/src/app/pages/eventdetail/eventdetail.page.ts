import { Component, OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Event } from '../calender/calender.model';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController, NavController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { Router, NavigationExtras } from '@angular/router';
import { EditeventPage } from '../editevent/editevent.page';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-eventdetail',
  templateUrl: './eventdetail.page.html',
  styleUrls: ['./eventdetail.page.scss'],
})
export class EventdetailPage implements OnInit {
  public eventdet: Event = {} as Event;
  public eventID: number;
  start = '';
  end = '';
  lang = '';
  constructor(private database: DatabaseService, private alertctrl: AlertController,
              private router: Router, public EventDet: EditeventPage, public navctrl: NavController, private translate: TranslateService) {
                this.lang = this.database.lang;
                this.translate.setDefaultLang('en');
                this.translate.use(this.lang);
               }

  ngOnInit() {

  }
/*
  fetcheventdetails(eventid) {
    const single_event: Event = {} as Event;
    this.eventdet.eventid = eventid;
    console.log('the id is' + this.eventdet.eventid);
    this.eventdet.eventid = 18;
    this.eventdet.empid = 1;
    this.eventdet.title = 'd4';
    this.eventdet.desc = 'test';
    this.eventdet.starttime = '2019-07-19-23:00:00';
    this.eventdet.poa = 'sangli';
    this.eventdet.pod = 'pune';
    this.eventdet.absent_hrs = '4.5';
    this.eventdet.da = 100;
    this.eventdet.ta = 10;
    console.log(this.eventdet.ta);
  }
*/
 ionViewDidEnter(eventid, offset) {
  this.fetcheventdetails(eventid, offset);
 }

 senddata() {
  this.eventdet.title = 'test';
  const navextras: NavigationExtras = {
    queryParams: {
      singlevent: this.eventdet.title
    }
  };
  console.log(this.eventdet.starttime);
  this.router.navigate(['editevent'], navextras);
  }

  senddatadb() {
    console.log('the ID in event detail page is ' + this.eventdet.eventid);
    console.log('The ID for eventID var is' + this.eventID);
    this.database.storedata(this.eventdet);
    this.router.navigate(['editevent']);
  }


fetcheventdetails(eventid, offset) {
  console.log('this is the offser' + offset);
  // tslint:disable-next-line: variable-name
  const single_event: Event = {} as Event;
  this.eventdet.eventid = eventid;
  this.eventID = eventid;
  console.log('the id is' + this.eventdet.eventid);
  this.database.geteventdetails(this.eventdet.eventid)
.then(details => { console.log('the details are ' + details);
                    // tslint:disable-next-line: forin
                   for (const prop in details) {
                      console.log(prop + '=' + details[prop]);
                      if (prop === 'title') {
                        this.eventdet.title = details[prop];
                        console.log('eventdet title is ' + this.eventdet.title);
                        single_event.title = details[prop];
                      } else if (prop === 'desc') {
                        this.eventdet.desc = details[prop];
                        single_event.desc = details[prop];
                      } else if (prop === 'starttime') {
                        this.eventdet.starttime = details[prop];
                        single_event.starttime = details[prop];
                        this.eventdet.starttime = moment.utc(this.eventdet.starttime).local().format('YYYY-MM-DD HH:mm:ss');
                      } else if (prop === 'endtime') {
                        this.eventdet.endtime = details[prop];
                        single_event.endtime = details[prop];
                        this.eventdet.endtime = moment.utc(this.eventdet.endtime).local().format('YYYY-MM-DD HH:mm:ss');
                      } else if (prop === 'ta') {
                        this.eventdet.ta = Number(details[prop]);
                        single_event.ta = Number(details[prop]);
                      } else if (prop === 'da') {
                        this.eventdet.da = Number(details[prop]);
                        single_event.da = Number(details[prop]);
                      } else if (prop === 'absent_hrs') {
                        this.eventdet.absent_hrs = details[prop];
                        single_event.absent_hrs = details[prop];
                      } else if (prop === 'poa') {
                        this.eventdet.poa = details[prop];
                        single_event.poa = details[prop];
                      } else if (prop === 'pod') {
                        this.eventdet.pod = details[prop];
                        single_event.pod = details[prop];
                      } else if (prop === 'eventid') {
                        single_event.eventid = Number(details[prop]);
                        this.eventID = Number(details[prop]);
                        this.eventdet.eventid = Number(details[prop]);
                      } else if (JSON.stringify(prop) === 'empid') {
                        this.eventdet.empid = Number(details[prop]);
                        single_event.empid = Number(details[prop]);
                      } else if (JSON.stringify(prop) === 'date') {
                        this.eventdet.date = JSON.stringify(details[prop]);
                        single_event.date = JSON.stringify(details[prop]);
                      } else if (JSON.stringify(prop) === 'title') {
                        this.eventdet.title = JSON.stringify(details[prop]);
                        console.log('eventdet title is ' + this.eventdet.title);
                        single_event.title = JSON.stringify(details[prop]);
                      } else if (JSON.stringify(prop) === 'desc') {
                        this.eventdet.desc = JSON.stringify(details[prop]);
                        single_event.desc = JSON.stringify(details[prop]);
                      } else if (JSON.stringify(prop) === 'starttime') {
                        this.eventdet.starttime = JSON.stringify(details[prop]);
                        single_event.starttime = JSON.stringify(details[prop]);
                        this.eventdet.starttime = moment.utc(this.eventdet.starttime).local().format('YYYY-MM-DD HH:mm:ss');
                      } else if (JSON.stringify(prop) === 'endtime') {
                        this.eventdet.endtime = JSON.stringify(details[prop]);
                        single_event.endtime = JSON.stringify(details[prop]);
                        this.eventdet.endtime = moment.utc(this.eventdet.endtime).local().format('YYYY-MM-DD HH:mm:ss');
                      } else if (JSON.stringify(prop) === 'ta') {
                        this.eventdet.ta = Number(details[prop]);
                        single_event.ta = Number(details[prop]);
                      } else if (JSON.stringify(prop) === 'da') {
                        this.eventdet.da = Number(details[prop]);
                        single_event.da = Number(details[prop]);
                      } else if (JSON.stringify(prop) === 'absent_hrs') {
                        this.eventdet.absent_hrs = JSON.stringify(details[prop]);
                        single_event.absent_hrs = JSON.stringify(details[prop]);
                      } else if (JSON.stringify(prop) === 'poa') {
                        this.eventdet.poa = JSON.stringify(details[prop]);
                        single_event.poa = JSON.stringify(details[prop]);
                      } else if (JSON.stringify(prop) === 'pod') {
                        this.eventdet.pod = JSON.stringify(details[prop]);
                        single_event.pod = JSON.stringify(details[prop]);
                      } else if (prop === 'eventid') {
                        this.eventID = Number(details[prop]);
                        single_event.eventid = Number(details[prop]);
                        this.eventdet.eventid = Number(details[prop]);
                        // continue;
                      } else if (JSON.stringify(prop) === 'empid') {
                        this.eventdet.empid = Number(details[prop]);
                        single_event.empid = Number(details[prop]);
                      } else if (JSON.stringify(prop) === 'date') {
                        this.eventdet.date = JSON.stringify(details[prop]);
                        single_event.date = JSON.stringify(details[prop]);
                      } else {
                        continue;
                        console.log(JSON.stringify(prop) + '=======' + prop);
                      }
                   }
                   if (offset > 0) {
        this.eventdet.starttime = moment.utc(this.eventdet.starttime).subtract(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        single_event.starttime = moment.utc(this.eventdet.starttime).subtract(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        this.eventdet.endtime = moment.utc(this.eventdet.endtime).subtract(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        single_event.endtime = moment.utc(this.eventdet.endtime).subtract(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      } else {
        this.eventdet.starttime = moment.utc(this.eventdet.starttime).add(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        single_event.starttime = moment.utc(this.eventdet.starttime).add(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        console.log('In the loop for evt det ' + this.eventdet.starttime + single_event.starttime);
        this.eventdet.endtime = moment.utc(this.eventdet.endtime).add(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
        single_event.endtime = moment.utc(this.eventdet.endtime).add(offset, 'minutes').format('YYYY-MM-DD HH:mm:ss');
      }
                    }).catch(error => console.error('error is ' + error));
}

deleteEvent() {
  console.log('in the del method the eventid is ' + this.eventdet.eventid);
  console.log(' in the del method the eventID is ' + this.eventID);
  this.database.deleteevent(this.eventdet.eventid)
  .then(data => { console.log('data to be printed is ' + data);
                  if (data) {
                      console.log('Event deletion is successful');
                      this.router.navigate(['calender']);
                    } else {
                      throw new Error ('Event deletion failed');
                    }
// tslint:disable-next-line: forin
                    })
    .catch(error => { console.error(error); });
  }

  updateEvent() {
  }
  async ondeleteAlert(eventid) {
      const alert = await this.alertctrl.create({
      header: 'Alert',
      subHeader: 'Delete this Event?',
      message: 'Are you sure you want to delete this event?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (alertdata) => {
            console.log('Confirm Ok');
            console.log('alert data is ' + alertdata + ' the event id is ' + eventid);
            this.deleteEvent();
          }
        }
      ]
    });
      await alert.present();
  }
}
