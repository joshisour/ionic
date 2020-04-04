import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'calender', loadChildren: './pages/calender/calender.module#CalenderPageModule' },
  { path: 'eventdetail', loadChildren: './pages/eventdetail/eventdetail.module#EventdetailPageModule' },
  { path: 'editevent', loadChildren: './pages/editevent/editevent.module#EditeventPageModule' },
  { path: 'testreport', loadChildren: './pages/testreport/testreport.module#TestreportPageModule' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
