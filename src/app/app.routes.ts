import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { HeaderComponent } from './component/header/header.component';

export const routes: Routes = [
    {
        path:'', component:LoginComponent
    },
    {
        path:'login', component:LoginComponent
    },
    {
        path:'', component: HeaderComponent,
        children:[
            {
                path:'dashboard', component:DashboardComponent
            }
        ]
        
    }
];
