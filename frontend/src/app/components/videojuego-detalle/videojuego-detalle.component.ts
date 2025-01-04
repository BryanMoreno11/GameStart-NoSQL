import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperContainer } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { ActivatedRoute } from '@angular/router';
import { VideojuegosService } from '../../services/videojuegos.service';
import { FormsModule } from '@angular/forms';
import { CarritoService, IProducto } from '../../services/carrito.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-videojuego-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './videojuego-detalle.component.html',
  styleUrl: './videojuego-detalle.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VideojuegoDetalleComponent implements OnInit {
  //-------------------------------------------atributos--------------------------------------------
  videojuego: any;
  videojuegoId: string = '';
  cantidad: number = 1;
  //swipers
  swiperPrincipal = signal<SwiperContainer | null>(null);
  swiperMiniatura = signal<SwiperContainer | null>(null);
  zoomActivado: Boolean = false;
  //----------------------------------------Métodos-----------------------------------------------

  constructor(
    private videojuego_service: VideojuegosService,
    private activatedRoute: ActivatedRoute,
    private carrito_service: CarritoService,
    private productos_service: ProductosService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.videojuegoId = params['id'];
    });
  }

  ngOnInit(): void {
    //Esto es para que al regresar se recargue el componente y muestre el videojuego con el stock reducido
    if (performance.navigation.type === 2) {
      location.reload();
    }
    window.scrollTo(0, 0);
    this.inicializarSwiperPrincipal();
    this.inicializarSwiperMiniatura();
    //Obtener Videojuego
    this.cargarVideojuego();
  }

  cargarVideojuego() {
    console.log('El id del videojuego es ', this.videojuegoId);

    this.productos_service.getProducto(this.videojuegoId).subscribe((res) => {
      this.videojuego = res;
      console.log('El videojuego es ', this.videojuego);
    });
  }

  //#region swipers
  inicializarSwiperMiniatura() {
    const swiperMiniaturaElementConstrutor =
      document.querySelector('.swiper-miniatura');
    const swiperMiniaturaOptions: SwiperOptions = {
      slidesPerView: 3,
      breakpoints: {
        1200: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
      },
      spaceBetween: 30,
      navigation: {
        enabled: true,
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    };
    if (swiperMiniaturaElementConstrutor) {
      Object.assign(swiperMiniaturaElementConstrutor, swiperMiniaturaOptions);
    }
    this.swiperMiniatura.set(
      swiperMiniaturaElementConstrutor as SwiperContainer
    );
    this.swiperMiniatura()?.initialize();
  }

  inicializarSwiperPrincipal() {
    const swiperPrincipalElementConstrutor =
      document.querySelector('.swiper-principal');
    const swiperPrincipalOptions: SwiperOptions = {
      direction: 'horizontal',
      autoHeight: true,
      navigation: true,
    };
    if (swiperPrincipalElementConstrutor) {
      Object.assign(swiperPrincipalElementConstrutor, swiperPrincipalOptions);
    }
    this.swiperPrincipal.set(
      swiperPrincipalElementConstrutor as SwiperContainer
    );
    this.swiperPrincipal()?.initialize();
  }

  //#region zoom
  /**
   * Realiza zoom sobre una imagen
   * llama al método zoom(), caso contrario llama al método zoomOut()
   * @param {HTMLDivElement} imagen : Es el contenedor html de la imagen a la que le haremos zoom
   * @param {MouseEvent} event : Lo usamos para obtener la posición del Mouse
   * @param {string} imagen_ruta : Dirección URL de la imagen que se mostrará en el zoom
   */
  zoom(imagen: HTMLDivElement, event: MouseEvent, imagen_ruta: string) {
    if (this.zoomActivado) {
      imagen.style.setProperty('--url', `url(${imagen_ruta})`);
      imagen.style.setProperty('--display', 'block');
      let pointer = {
        x: (event.offsetX * 100) / imagen.offsetWidth,
        y: (event.offsetY * 100) / imagen.offsetHeight,
      };
      imagen.style.setProperty('--zoom-x', pointer.x + '%');
      imagen.style.setProperty('--zoom-y', pointer.y + '%');
    }
  }

  zoomOut(imagen: HTMLDivElement) {
    imagen.style.setProperty('--display', 'none');
    this.zoomActivado = false;
  }

  /**
   * Cambia el estado del zoom. Si está en estado activo lo desactiva y viceversa. Si el estado del zoom esta activo
   * llama al método zoom(), caso contrario llama al método zoomOut()
   * @param {Boolean} estado
   * @param {HTMLDivElement} imagen : Es el contenedor html de la imagen a la que le haremos zoom
   * @param {MouseEvent} event : Lo usamos para obtener la posición del Mouse al hacer clic
   * @param {string} imagen_ruta : Dirección URL de la imagen que se mostrará en el zoom
   */
  cambiarEstadoZoom(
    estado: Boolean,
    imagen: HTMLDivElement,
    event: MouseEvent,
    imagen_ruta: string
  ) {
    this.zoomActivado = estado;
    if (this.zoomActivado) {
      this.zoom(imagen, event, imagen_ruta);
    } else {
      this.zoomOut(imagen);
    }
  }

  //#region metodos_compra
  incrementar() {
    if (this.cantidad < this.videojuego.stock) {
      this.cantidad++;
    }
  }
  decrementar() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  changeCantidad() {
    if (this.cantidad == null || isNaN(this.cantidad) || this.cantidad <= 0  ) {
      this.cantidad = 1;
    }
  }

  agregarProductoCarrito(producto: IProducto) {
    if (
      this.carrito_service.validarStockProductoInsertar(producto, this.cantidad)
    ) {
      this.carrito_service.insertarProducto(producto, this.cantidad);
    }else{
      this.cantidad=1;
    }
  }
}
