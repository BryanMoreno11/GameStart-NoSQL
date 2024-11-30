import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export default class SidebarComponent {
  
  constructor(private router: Router) { }

  goToHome(){
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
