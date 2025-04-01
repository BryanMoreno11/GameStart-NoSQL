import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  navbarOpen = false;
  linkText: string = 'Cerrar sesión';
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
    const token= localStorage.getItem('loginAdmin');
    if(valor || token){
      this.isLoggedIn = valor;
    }else{
      this.linkText = 'Inicio de sesión';
      this.linkRoute = '/login-client';
    }
  }

  logout(){
    const valor = localStorage.getItem('loginUsuario') === 'true';
    const token= localStorage.getItem('loginAdmin');
    if(valor || token){
    console.log('Se esta borrando...');
    localStorage.clear();
    this.isLoggedIn = false;
    this.actualizarNavbar();
    this.mostrarMensaje("Cierre de sesión", "Sesión cerrada con éxito", "success");
    }
  }

  mostrarMensaje(titulo:string, mensaje:string, icono:any) {
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono
      });
  }





}