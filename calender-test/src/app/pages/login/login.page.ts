import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { ReportsService } from '../../services/reports.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  lang = '';
  constructor(private db: DatabaseService, private rep: ReportsService, private router: Router) { }

  ngOnInit() {
  }
cancel() {}
change() {
  console.log('the value selected is ' + this.lang);
  this.db.lang = this.lang;
  this.rep.lang = this.lang;
  if (this.lang !== 'undefined') {
    this.router.navigate(['calender']);
  } else {
    throw new Error('No language selected');
  }
}
}
