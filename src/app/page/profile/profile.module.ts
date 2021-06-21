import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { ProfileComponent } from './profile.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbDropdownModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { WorkInformationComponent } from './work-information/work-information.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const routes: Routes = [
    {
      path: '',
      redirectTo: 'personal-information',
      pathMatch: 'full'
    },
    {
        path: 'profile',
        redirectTo: 'personal-information', 
    },
    {
        path: 'personal-information',
        component: PersonalInformationComponent
    },
    {
        path: 'work-information',
        component: WorkInformationComponent
    }
  ]

@NgModule({
  declarations: [ProfileComponent, ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    NgbDropdownModule,
    NgbCollapseModule,
    PerfectScrollbarModule,
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ProfileModule { }
