import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { HeaderComponent } from './component/header/header.component';
import { AdminComponent } from './component/admin/admin.component';
import { authGuard } from './guard/auth.guard';
import { PieChartComponent } from './component/pie-chart/pie-chart.component';

export const routes: Routes = [
    {
        path:'', component:LoginComponent
    },
    {
        path:'login', component:LoginComponent
    },
    {
        path: '', component: HeaderComponent,
        children: [
          {
            path: 'dashboard', component: DashboardComponent,
            canActivate: [authGuard], 
            data: { role: 'user' }     // Only allow 'user' role
          },
          {
            path: 'admin', component: AdminComponent,
            canActivate: [authGuard],  
            data: { role: 'admin' }    // Only allow 'admin' role
          }
        ]
      },
      {
        path:'analysis', component:PieChartComponent
      }
];
