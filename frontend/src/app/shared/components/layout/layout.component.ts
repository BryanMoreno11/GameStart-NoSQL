import { Component,OnInit, OnDestroy } from '@angular/core';
import SidebarComponent from '../sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../../services/layout.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [SidebarComponent,RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export default class LayoutComponent implements OnInit, OnDestroy {
  isSidebarOpen = false;

  constructor(private layoutService: LayoutService, private router:Router) { }

  ngOnInit() {
   //this.activarmodoAdmin();
  }

  ngOnDestroy() {
    this.layoutService.setLayout(true);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    const sidebar = document.querySelector('app-sidebar')?.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open', this.isSidebarOpen);
    }
  }

  activarmodoAdmin(){
    const valor = localStorage.getItem('loginAdmin') === 'true';
    if (!valor) {
      this.router.navigate(['/inicio']);
    }
    this.layoutService.setLayout(false);
  }
}