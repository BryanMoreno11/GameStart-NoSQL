import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PedidoService } from '../../services/pedidos.service';
import { ProductosService, Producto } from '../../services/productos.service';
import { ApiPedido, Pedido } from '../../models/pedido';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.css']
})
export default class AdminPedidosComponent implements OnInit {
  pedidos: ApiPedido[] = [];
  productos: Producto[] = [];
  proveedores: any[] = [];
  videojuegosPlataformas: any[] = [];
  sucursales: any[] = [];
  selectedPedido: ApiPedido = this.initializePedido();
  isFormVisible: boolean = false;
  isEditing: boolean = false;
  validationMessages: { [key: string]: string } = {};

  constructor(private pedidoService: PedidoService, 
              private cdr: ChangeDetectorRef,
              private productoService: ProductosService) { }

  ngOnInit(): void {
    this.getPedidos();
    this.getProveedores();
    this.getVideojuegosPlataformas();
    this.getSucursales();
    this.getVideojuegos();
  }

  getPedidos(): void {
    this.pedidoService.getPedidos().subscribe(pedidos => {
      console.log(pedidos);
      this.pedidos = pedidos;
    });
  }

  getProveedores(): void {
    this.pedidoService.getProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
      console.log('Los proveedores son', proveedores);
      this.cdr.detectChanges();
    });
  }

  getVideojuegos(): void{
    this.productoService.getProductos().subscribe(productos => {
      this.productos = productos;
      this.cdr.detectChanges();
    })
  }

  getVideojuegosPlataformas(): void {
    console.log('Obteniendo Videojuegos Plataformas...');
    this.pedidoService.getVideojuegosPlataformas().subscribe(videojuegosPlataformas => {
      this.videojuegosPlataformas = videojuegosPlataformas;
      console.log(this.videojuegosPlataformas);
      this.cdr.detectChanges();
    });
  }

  getSucursales(): void {
    this.pedidoService.getSucursales().subscribe(sucursales => {
      this.sucursales = sucursales;
      this.cdr.detectChanges();
    });
  }

  calculateTotal(): number {
    const { precio_unitario, cantidad, descuento } = this.selectedPedido;
    if (precio_unitario !== null && cantidad !== null && descuento !== null) {
      const total = precio_unitario * cantidad * (1 - descuento);
      return total >= 0 ? total : 0;
    }
    return 0;
  }

  updateTotal(): void {
    // Forzamos la actualización del total cuando cambian los valores
    this.selectedPedido.total = this.calculateTotal();
  }

  validatePedido(): boolean {
    this.validationMessages = {};

    if (Number(this.selectedPedido.proveedor._id) === -1) {
      this.validationMessages['_id'] = 'Seleccione un proveedor.';
    }

    if (Number(this.selectedPedido.producto.plataforma.nombre )=== -1) {
      this.validationMessages['id_videojuego_plataforma'] = 'Seleccione un videojuego plataforma.';
    }

    if (this.selectedPedido.precio_unitario === null || this.selectedPedido.precio_unitario <= 0) {
      this.validationMessages['precio_unitario'] = 'Ingrese un precio unitario válido mayor a 0).';
    }

    if (this.selectedPedido.cantidad === null || this.selectedPedido.cantidad <= 0) {
      this.validationMessages['cantidad'] = 'Ingrese una cantidad válida mayor 0).';
    }

    if (this.selectedPedido.descuento === null || this.selectedPedido.descuento < 0 || this.selectedPedido.descuento > 1) {
      this.validationMessages['descuento'] = 'Ingrese un descuento válido (de 0 a 1).';
    }

    return Object.keys(this.validationMessages).length === 0;
  }

  savePedido(): void {
    if (!this.validatePedido()) {
      console.log('Errores de validación:', this.validationMessages);
      return;
    }

    this.selectedPedido.total = this.calculateTotal(); // Actualizar total antes de guardar

    if (this.isEditing && this.selectedPedido._id) {
      console.log('Actualizando pedido...', this.selectedPedido);
      this.pedidoService.updatePedido(this.selectedPedido._id, this.selectedPedido).subscribe(() => {
        this.getPedidos();
        this.isFormVisible = false;
        this.selectedPedido = this.initializePedido();
      });
    } else {
      // Validar si el ID del nuevo pedido ya existe
      if (this.pedidos.some(p => p._id === this.selectedPedido._id)) {
        alert('El ID del pedido ya existe.');
        return;

      }
      console.log('Los videojuegos son ',this.productos);
      console.log('Guardando pedido...', this.selectedPedido);
      this.pedidoService.addPedido(this.selectedPedido).subscribe(() => {
        this.getPedidos();
        this.isFormVisible = false;
        this.selectedPedido = this.initializePedido();
      });
    }
  }

  editPedido(pedido: ApiPedido): void {
    this.selectedPedido = { ...pedido }; // Hacer una copia del objeto
    this.isEditing = true;
    this.isFormVisible = true;
    this.selectedPedido.proveedor = this.proveedores.find(proveedor => proveedor._id === this.selectedPedido.proveedor._id) || this.initializePedido().proveedor;
    this.selectedPedido.producto = this.productos.find(producto => producto._id === this.selectedPedido.producto._id) || this.initializePedido().producto;
    this.selectedPedido.producto.plataforma = this.videojuegosPlataformas.find(plataforma => plataforma.nombre === pedido.producto.plataforma.nombre);
  }
  

  showInsertForm(): void {
    this.selectedPedido = this.initializePedido();
    this.isFormVisible = true;
    this.isEditing = false;
  }

  deletePedido(id: number): void {
    this.pedidoService.deletePedido(id).subscribe(() => this.getPedidos());
  }


  initializePedido(): ApiPedido {
    return {
      _id: '-1',
      proveedor: {
        _id: '-1',
        nombre: '',
        celular: '',
        correo: '',
        direccion: '',
        fecha_creacion: '',
      },
      producto: {
        _id: '-1',
        nombre: '',
        desarrolladora: '',
        plataforma: {
          nombre: '',
          descripcion: '',
          fecha_creacion: '',
        },
        genero: {
          nombre: '',
          descripcion: '',
          fecha_creacion: '',
        },
        tipo: {
          nombre: '',
          descripcion: '',
          fecha_creacion: '',
        },
        precio: 0,
        stock: 0,
        imagenes: [],
        fecha_creacion: '',
        descripcion: '',
        claves_digitales: []
      },
      precio_unitario: 0,
      cantidad: 0,
      descuento: 0,
      total: 0,
      fecha_pedido: '',
    };
  }
  

  closeModal(): void {
    this.isFormVisible = false;
    this.getPedidos();
    this.selectedPedido = this.initializePedido();
  }
}
