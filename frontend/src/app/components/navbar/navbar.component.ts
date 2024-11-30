import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navbarOpen = false;
  linkText: string = 'Mi cuenta';
  linkRoute: string = '/login-client';
  isLoggedIn: boolean = false;

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  ngOnInit() {
    this.actualizarNavbar();
  }

  actualizarNavbar() {
    const valor = localStorage.getItem('loginUsuario') === 'true';
    if(valor){
      const nombreCliente = localStorage.getItem('nombre_cliente');
      this.linkText = nombreCliente ? nombreCliente : 'Inicio de sesión';
      this.linkRoute = '/mi-cuenta';
      this.isLoggedIn = valor;
    }else{
      this.linkText = 'Inicio de sesión';
      this.linkRoute = '/login-client';
    }
  }

  logout(){
    console.log('Se esta borrando...');
    localStorage.clear();
    this.isLoggedIn = false;
    this.actualizarNavbar();
  }
}