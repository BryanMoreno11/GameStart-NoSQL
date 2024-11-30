import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import LayoutComponent from './shared/components/layout/layout.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { LayoutService } from './services/layout.service'; 
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FooterComponent,LayoutComponent,NavbarComponent,CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Game Start';
  showLayout: boolean = true;

  constructor(private layoutService: LayoutService) { }

  ngOnInit() {
    this.layoutService.showLayout$.subscribe(show => this.showLayout = show);
  }
}