import { Component } from '@angular/core';
import {
  CarritoService,
 IProducto,
 ICarrito,
 Cliente,
} from '../../services/carrito.service';
import { ClientesService } from '../../services/clientes.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  //Atributos para la factura
  vistaVenta: any;
  vistaVentaDetalle: any;
   //Cliente de ejemplo
   cliente:Cliente= {
    _id: "",
    cedula: "",
    nombre: "",
    apellido: "",
    telefono: "",
    correo: "",
    contrasenia: "",
    secret: "",
    fecha_nacimiento: new Date(),
    fecha_registro: new Date()
  }
  //#region Métodos
  constructor(
    private carrito_service: CarritoService,
    private httpclien: HttpClient,
    private router: Router,
    private clientes_service: ClientesService,
  ) {
    this.productos = carrito_service.carrito.productos;
    this.carrito = carrito_service.carrito;
  }

  ngOnInit(){
    this.getCliente();
  }

  getCliente(){
    const token = localStorage.getItem('authToken');
    console.log('El token que estamos enviando es: ', token);
    if(token){
      this.clientes_service.getClienteLoginToken(token).subscribe(
        res => {
          console.log('La respuesta que obtenemos es: ', res);
          this.cliente=res;
          console.log('El cliente obtenido desde el token es ', this.cliente);
        }
      )
    }
  }

  actualizarCantidad(producto: IProducto, cantidad: number) {
    if(this.carrito_service.validarStockProductoModificar(producto, cantidad) && this.validarCantidad(cantidad)){
      this.carrito_service.modificarProducto(producto, cantidad);
    }else{
      producto.cantidad = 1;
    } 

  }

  validarCantidad(cantidad: number) {
    if (cantidad == null || isNaN(cantidad) || cantidad <= 0 || cantidad%1 !== 0) {
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

  async realizarCompra() {
    if (this.cliente.correo !== "") {
      this.carrito.cliente = this.cliente;
      // Asignar la fecha actual a la venta en formato ISO
      this.carrito.fecha_venta = new Date().toISOString();
  
      const confirm = await this.confirmarCompra();
      if (confirm) {
        try {
          let respuesta = await this.registrarCompra();
          let venta = await this.obtenerVenta(respuesta.ventaId);
          console.log("La venta es", venta);
          this.vistaVenta = venta;
          this.enviarCorreoCliente();
          this.carrito_service.efectuarCompra();
          this.mostrarMensaje('¡Compra efectuada con éxito!', 'En su correo podrá ver la factura', 'success');
          this.carrito = this.carrito_service.carrito;
        } catch (error: any) {
          this.mostrarMensaje('¡Error!', error.message, 'error');
        }
      }
    } else {
      this.mostrarMensaje('¡Error!', 'Debes iniciar sesión para realizar la compra', 'error');
    }
  }
  

  async registrarCompra(){
   return await firstValueFrom (this.carrito_service.saveVenta(this.carrito));
    
  }

  async obtenerVenta(ventaId:string){
    return await firstValueFrom(this.carrito_service.getVenta(ventaId));
  }

  confirmarCompra(): Promise<boolean> {
    return Swal.fire({
      title: '¿Estás seguro de proceder con la compra?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => result.isConfirmed);
  }

  mostrarMensaje(titulo:string, mensaje:string, icono:any) {
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono
      });
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

  enviarCorreoCliente(){
    console.log("La vista es: ", this.vistaVenta);
    console.log("Enviando correo...");
    let params = {
      cedula: this.vistaVenta.cliente.cedula,
      nombre: this.vistaVenta.cliente.nombre,
      correo: this.vistaVenta.cliente.correo,
      fecha_venta: this.vistaVenta.fecha_venta,
      subtotal: this.vistaVenta.subtotal,
      iva: this.vistaVenta.iva,
      total_venta: this.vistaVenta.total,
      productos: this.vistaVenta.productos,
      id_venta: this.vistaVenta._id,
      ciudad: this.vistaVenta.cliente.id_ciudad,
      claves_digitales: this.vistaVenta.clavesUsuario
    }
    this.httpclien.post(`${environment.apiUrl}correo/`, params).subscribe(resp=>{
    });
  }
}
