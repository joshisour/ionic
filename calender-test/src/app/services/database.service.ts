import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Event } from '../pages/calender/calender.model';

@Injectable({
  providedIn: 'root'
})
// To be done later for modules
/// export interface Dev {
  // id: number,
  // name: string,
  // skills: any[],
  // img: string
// }
// Need to move this to calender.model.ts
/*
export interface event {
  eventid: number;
  empid: number;
  date: string;
  title: string;
  desc: string;
  starttime: string;
  endtime: string;
  ta: number;
  da: number;
  absent_hrs: string;
  poa: string;
  pod: string;
}
*/
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
// tslint:disable-next-line: variable-name
  events_arr: Event[] = [];
  // tslint:disable-next-line: variable-name
  single_event: Event = {} as Event;
  lang = '';
  // To be done for calender
 // eventbehsub = new BehaviorSubject([]);
  // products = new BehaviorSubject([]);
  constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
      this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'calender.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          console.log('db--ssds-----' + db);
          this.database = db;
          this.loadDatabase(); // This is the initial loading script into sql DB. We may not need it.
      });
    });

   }
   loadDatabase() {
    this.http.get('assets/dataload.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(templist => {
          templist = this.getevents();
           // This is fetching the data from DB and showing the events. Let us rename this method to getevents
          // this.loadProducts();
          this.dbReady.next(true);
          console.log(templist);
        })
        .catch(e => console.error(e));
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }
  /*
  getDevs(): Observable<Dev[]> {
    return this.developers.asObservable();
  }
  getProducts(): Observable<any[]> {
    return this.products.asObservable();
  }
  */
 getevents() {
  return this.database.executeSql('SELECT * FROM events', []).then(data => {
// tslint:disable-next-line: variable-name
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
    // this.eventbehsub.next(events_arr);
    console.log(events_arr);
    return events_arr;
  });
}
// Add an event
// addevent(empid, date, title, desc,ta,da, absent_hrs, poa, pod) {
  addevent(newevent: Event) {
// tslint:disable-next-line: variable-name
  // let temp_arr: event[] = [];
  console.log('into add event');
  const data = [newevent.empid, newevent.date, newevent.title, newevent.desc,
    newevent.starttime, newevent.endtime, newevent.ta, newevent.da, newevent.absent_hrs, newevent.poa, newevent.pod];
// tslint:disable-next-line: max-line-length
  return this.database.executeSql('INSERT INTO events (empid, date, title, desc, starttime, endtime, ta, da, absent_hrs, poa, pod) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', data)
    .then(eventlist => { console.log('Added the following event successfully ' + eventlist);
                         for (const property in eventlist) {
                          console.log(property + '=' + eventlist[property] + 'testopia');
                          console.log ('properties are ' + property + JSON.stringify(eventlist[property]));
                          if (property === 'rowsAffected' && JSON.stringify(eventlist[property]) === '1') {
                                    console.log ('event was added successfully ' + property);
                                    return 1;
                          } else {
                                    console.log ('event was not added successfully ' + property);
                                    // throw new Error ('event addition failed');
                          }
                      }
                     }).catch(error => console.error('error is ' + error));
    // console.log('Added the following event successfully ' + eventlist.VALUES);

// tslint:disable-next-line: variable-name
// return this.getevents();
}
deleteevent(eventid) {
  console.log('the event id is' + eventid);
  return this.database.executeSql('DELETE FROM events WHERE eventid = ?', [eventid])
  .then(eventlist => { console.log('Deleted the event with the following event id ' + eventid);
                       for (const property in eventlist) {
                        if (property === 'rowsAffected' && JSON.stringify(eventlist[property]) === '1') {
                              console.log ('Event was deleted successfully ' + property);
                              return 1;
                        } else {
                          console.log ('Event was not deleted successfully ' + property);
                        }
                    }
  }).catch(error => console.error(error));
}

geteventsbydate(startdate) {
 // return this.database.executeSql('SELECT * FROM events WHERE DATE(starttime) = \'2019-07-13\'', []).then(data => {
  return this.database.executeSql('SELECT * FROM events WHERE DATE(starttime) = ? ORDER BY starttime', [startdate]).then(data => {
// tslint:disable-next-line: variable-name
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
    // this.eventbehsub.next(events_arr);
    console.log(events_arr);
    return events_arr;
  });
}

geteventsbydate_new(start, end) {
  // return this.database.executeSql('SELECT * FROM events WHERE DATE(starttime) = \'2019-07-13\'', []).then(data => {
   return this.database.executeSql('SELECT * FROM events WHERE starttime BETWEEN  ? AND ? ORDER BY starttime', [start, end]).then(data => {
 // tslint:disable-next-line: variable-name
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
     // this.eventbehsub.next(events_arr);
     console.log(events_arr);
     return events_arr;
   });
 }


getempid(name) {
  return this.database.executeSql('SELECT empid FROM profile WHERE name = ?', [name]).then(empid => {
    return empid;
  });
}

geteventid(date, title, name) {
  const empid = this.getempid(name);
// tslint:disable-next-line: max-line-length
  return this.database.executeSql('SELECT eventid FROM events WHERE empid = ? AND date = ? AND title = ? ', [empid, date, title]).then(eventid => {
    return eventid;
  });
}
updateevent(newevent: Event) {
  const data = [newevent.eventid, newevent.empid, newevent.date, newevent.title, newevent.desc,
    newevent.starttime, newevent.endtime, newevent.ta, newevent.da, newevent.absent_hrs, newevent.poa, newevent.pod];
// tslint:disable-next-line: max-line-length
  return this.database.executeSql(`UPDATE events SET title = ?, desc = ?, starttime = ?, endtime = ?, ta = ?, da = ?, absent_hrs = ?, poa = ?, pod = ? WHERE eventid = ${newevent.eventid}`, [newevent.title, newevent.desc, newevent.starttime, newevent.endtime, newevent.ta, newevent.da, newevent.absent_hrs, newevent.poa, newevent.pod])
  .then(eventlist => {console.log('Updated the event with the following event id ' + newevent.eventid);
                      for (const property in eventlist) {
   if (property === 'rowsAffected' && JSON.stringify(eventlist[property]) === '1') {
         console.log ('Event was updated successfully ' + property);
         return 1;
   } else {
     console.log ('Event was not updated successfully ' + property);
   }
}
}).catch(error => console.error(error));
}

async flushall() {
 await this.database.executeSql('DELETE FROM events').then(_  => {
   console.log(_);
  }).catch(error => console.error(error));
}
geteventdetails(eventid) {
      console.log('event id ' + eventid);
      eventid = Number(eventid);
      return this.database.executeSql('SELECT * FROM events WHERE eventid = ?', [eventid]).then( data => { for (const property in data) {
          console.log('please print this');
          console.log(property + '=' + data[property]);
          if (property === 'rows') {
                console.log ('Event found ' + property);
                console.log(data[property].rows + 'these are the rows');
                console.log(data[property].length + 'this is the length');
                if (data.rows.length > 0) {
                  for (let i = 0; i < data.rows.length; i++) {
                      console.log(data.rows.item(i).empid);
                      console.log(data.rows.item(i).starttime);
                      console.log(data.rows.item(i).endtime);
                      this.single_event.eventid = data.rows.item(i).eventid;
                      this.single_event.empid = data.rows.item(i).empid;
                      this.single_event.title = data.rows.item(i).title;
                      this.single_event.desc = data.rows.item(i).desc;
                      this.single_event.starttime = data.rows.item(i).starttime;
                      this.single_event.endtime = data.rows.item(i).endtime;
                      this.single_event.ta = data.rows.item(i).ta;
                      this.single_event.da = data.rows.item(i).da;
                      this.single_event.absent_hrs = data.rows.item(i).absent_hrs;
                      this.single_event.poa = data.rows.item(i).poa;
                      this.single_event.pod = data.rows.item(i).pod;
                  }}}
          return this.single_event;
          } });
        }

storedata(eventobj) {
          this.single_event = eventobj;
          console.log(this.single_event.title);
        }
getdata() {
  console.log(this.single_event.title);
  return this.single_event;
}

geteventsbyrange(startdate, enddate) {
  // tslint:disable-next-line: max-line-length
   return this.database.executeSql('SELECT * FROM events WHERE DATE(starttime) BETWEEN  ? AND ? ORDER BY DATE(starttime)', [startdate, enddate]).then(data => {
 // tslint:disable-next-line: variable-name
    for (const property in data) {
      console.log('in the db method for getevents' + property + data[property]);
    }
    // tslint:disable-next-line: variable-name
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
     } // this.eventbehsub.next(events_arr);
    console.log(events_arr);
    return events_arr;
   });
 }

 geteventsbyrange_new(startdate, enddate) {
  // tslint:disable-next-line: max-line-length
   return this.database.executeSql('SELECT * FROM events WHERE starttime BETWEEN  ? AND ? ORDER BY starttime', [startdate, enddate]).then(data => {
 // tslint:disable-next-line: variable-name
    for (const property in data) {
      console.log('in the db method for getevents' + property + data[property]);
    }
    // tslint:disable-next-line: variable-name
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
     } // this.eventbehsub.next(events_arr);
    console.log(events_arr);
    return events_arr;
   });
 }


}
