import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { VideojuegoDetalleComponent } from './components/videojuego-detalle/videojuego-detalle.component';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { VerificacionTokenComponent } from './components/verificacion-token/verificacion-token.component';
import { AuthenticateQrComponent } from './components/authenticate-qr/authenticate-qr.component';
import { VideojuegosComponent } from './components/videojuegos/videojuegos.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import LayoutComponent from './shared/components/layout/layout.component';
import DashboardComponent from './bussines/dashboard/dashboard.component';
import AdminEmpleadosComponent from './bussines/admin-empleados/admin-empleados.component';
import AdminPedidosComponent from './bussines/admin-pedidos/admin-pedidos.component';
import { LoginClientComponent } from './components/login-client/login-client.component';
import { RegisterClientComponent } from './components/register-client/register-client.component';
import { ReportesComponent } from './components/reportes/reportes.component';

export const routes: Routes = [
  { path: 'inicio', component: InicioComponent },
  { path: 'videojuego/:id', component: VideojuegoDetalleComponent },
    {path: 'login', component: LoginUserComponent},
    {path: 'register', component: RegisterUserComponent},
    {path: 'token-verify', component: VerificacionTokenComponent},
    {path: 'qr-verify',component: AuthenticateQrComponent},
    { path: 'videojuegos', component: VideojuegosComponent },
    { path: 'carrito', component: CarritoComponent },
    {path:'reportes', component:ReportesComponent},
    { path: 'login-client', component: LoginClientComponent },
    { path: 'register-client', component: RegisterClientComponent },
  {
    path: 'admin',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'empleados', component: AdminEmpleadosComponent },
      { path: 'pedidos', component: AdminPedidosComponent },
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },  // Redirecciona a 'inicio'
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' }  // Captura rutas no definidas y redirige a 'inicio'
];
