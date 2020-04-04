import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { Event } from '../calender/calender.model';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { AlertController } from '@ionic/angular';
import { formatDate } from '@angular/common';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-editevent',
  templateUrl: './editevent.page.html',
  styleUrls: ['./editevent.page.scss'],
})
export class EditeventPage implements OnInit {
  public curreventdet: Event = {} as Event;
  editform: FormGroup;
  public inactive = true;
  lang = '';
  minDate = new Date().toISOString();
  // tslint:disable-next-line: max-line-length
  constructor(private formbuilder: FormBuilder, private database: DatabaseService, private route: ActivatedRoute, private router: Router, private translate: TranslateService) {
    this.curreventdet = this.database.getdata();
    console.log('this' + this.curreventdet.title);
    console.log('this' + this.curreventdet.eventid);
    this.lang = this.database.lang;
    translate.setDefaultLang('en');
    this.translate.use(this.lang);


  }

  ngOnInit() {

  }
  ionViewDidEnter() {
        this.inactive = false;
        console.log('this' + this.curreventdet.title);
   }

disableedit() {
  this.inactive = true;
  this.router.navigate(['eventdetail']);
}
saveedit() {
console.log(this.curreventdet.title);
console.log(this.curreventdet.eventid + 'printing in the edit event page');
this.curreventdet.starttime = moment.utc(this.curreventdet.starttime).format('YYYY-MM-DD HH:mm:ss');
this.curreventdet.endtime = moment.utc(this.curreventdet.endtime).format('YYYY-MM-DD HH:mm:ss');
this.database.updateevent(this.curreventdet).then(data => {
  if (data) {
  console.log('Event updation is successful');
  this.inactive = true;
  this.router.navigate(['eventdetail']);
  } else {
    throw new Error ('Event updation has failed');
  }
});
}

}
