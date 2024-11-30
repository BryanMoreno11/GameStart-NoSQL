import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import {SwiperContainer} from 'swiper/element/bundle';
import {SwiperOptions} from 'swiper/types';
import { VideojuegosService } from '../../services/videojuegos.service';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class InicioComponent {
 //-----------------------------------Atributos---------------------------------
 swiperPrincipal=signal<SwiperContainer|null>(null);
 swiperVideojuegoElement=signal<SwiperContainer|null>(null);
 videojuegos:any;
//------------------------------------Métodos--------------------------------------

constructor(private videojuegos_service:VideojuegosService){
 
}
 //#region Swipers
 ngOnInit(): void {
  //Obtener Videojuegos
  this.videojuegos= this.videojuegos_service.getVideojuegos();
  //Llamada a los swipers
  this.inicializarSwiperPrincipal();
  this.inicializarSwiperVideojuegos();
 }
 inicializarSwiperPrincipal(){
  const swiperPrincipalElementConstrutor= document.querySelector('.swiper-principal');
  const swiperPrincipalOptions:SwiperOptions={
    pagination:{
      clickable:true
    },
    navigation: {
      enabled:true
    }
  };
  if(swiperPrincipalElementConstrutor){
    Object.assign(swiperPrincipalElementConstrutor, swiperPrincipalOptions);
  }
  this.swiperPrincipal.set(swiperPrincipalElementConstrutor as SwiperContainer);
  this.swiperPrincipal()?.initialize();
}

inicializarSwiperVideojuegos(){
  const swiperVideojuegoElementConstrutor= document.querySelector('.swiper-videojuegos');
  const swiperVideojuegoOptions:SwiperOptions={
    pagination:true,
    slidesPerView:2,
    spaceBetween:10,
    breakpoints: {    
      768: {
        slidesPerView: 3,
        spaceBetween: 30
      },
      992: {
        slidesPerView: 4,
        spaceBetween: 30
      },
      1200: {
        slidesPerView: 5,
        spaceBetween: 30
      },          
    },

  };
  if(swiperVideojuegoElementConstrutor){
    Object.assign(swiperVideojuegoElementConstrutor, swiperVideojuegoOptions);
  }
  this.swiperVideojuegoElement.set(swiperVideojuegoElementConstrutor as SwiperContainer);
  this.swiperVideojuegoElement()?.initialize();
}

}
