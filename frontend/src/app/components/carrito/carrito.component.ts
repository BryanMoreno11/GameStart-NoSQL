import { Component } from '@angular/core';
import {
  CarritoService,
 IProducto,
 ICarrito
} from '../../services/carrito.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent {
  //#region atributos
  productos: IProducto[] = [];
  carrito: ICarrito;
  //Atributos para insertar en la BD
  id_cliente: number;
  //Atributos para la factura
  vistaVenta: any;
  vistaVentaDetalle: any;
  //#region Métodos
  constructor(
    private carrito_service: CarritoService,
    private httpclien: HttpClient,
    private router: Router
  ) {
    this.productos = carrito_service.carrito.productos;
    this.carrito = carrito_service.carrito;
    this.id_cliente = Number(localStorage.getItem('id_cliente'));
  }

  actualizarCantidad(producto: IProducto, cantidad: number) {
    if(this.carrito_service.validarStockProductoModificar(producto, cantidad) && this.validarCantidad(cantidad)){
      this.carrito_service.modificarProducto(producto, cantidad);
    }else{
      producto.cantidad = 1;
    } 

  }

  validarCantidad(cantidad: number) {
    if (cantidad == null || isNaN(cantidad) || cantidad <= 0) {
      return false
    }
    return true;

  }

  aumentar(producto: IProducto) {
    if (producto.cantidad  < producto.stock) {
      producto.cantidad = producto.cantidad+1;
      this.actualizarCantidad(producto, producto.cantidad);
    }
  }

  decrementar(producto: IProducto) {
    if (producto.cantidad> 1) {
      producto.cantidad = producto.cantidad-1;
      this.actualizarCantidad(producto, producto.cantidad );
    }
  }

  eliminarProducto(idProducto:number | string) {
    Swal.fire({
      title: '¿Estás seguro de eliminar este producto del carrito?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.carrito_service.eliminarProductoCarrito(idProducto);
        this.carrito= this.carrito_service.carrito;
        Swal.fire({
          title: '¡Producto Eliminado!',
          icon: 'success',
        });
      }
    });
  }

  realizarCompra() {
    if (true) {
      Swal.fire({
        title: '¿Estás seguro de proceder con la compra?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          this.carrito_service.efectuarCompra();
          Swal.fire({
            title: '¡Compra efectuada con éxito!',
            text: 'En su correo podrá ver la factura',
            icon: 'success',
          });
          this.carrito=this.carrito_service.carrito;

        }
      });
    }
  }

  verificarSesion() {
    const valor = localStorage.getItem('loginUsuario') === 'true';
    if (!valor) {
      Swal.fire({
        title: '¡Debes iniciar sesión para realizar la compra!',
        icon: 'warning',
      });
      this.router.navigate(['/login-client']);
      return false;
    }
    return true;
  }
}
