import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PedidoService } from '../../services/pedidos.service';
import { Pedido } from '../../models/pedido';
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
  pedidos: Pedido[] = [];
  proveedores: any[] = [];
  videojuegosPlataformas: any[] = [];
  sucursales: any[] = [];
  selectedPedido: Pedido = this.initializePedido();
  isFormVisible: boolean = false;
  isEditing: boolean = false;
  validationMessages: { [key: string]: string } = {};

  constructor(private pedidoService: PedidoService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getPedidos();
    this.getProveedores();
    this.getVideojuegosPlataformas();
    this.getSucursales();
  }

  getPedidos(): void {
    this.pedidoService.getPedidos().subscribe(pedidos => {
      this.pedidos = pedidos;
    });
  }

  getProveedores(): void {
    this.pedidoService.getProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
      this.cdr.detectChanges();
    });
  }

  getVideojuegosPlataformas(): void {
    this.pedidoService.getVideojuegosPlataformas().subscribe(videojuegosPlataformas => {
      this.videojuegosPlataformas = videojuegosPlataformas;
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

    if (this.selectedPedido.id_proveedor === -1) {
      this.validationMessages['id_proveedor'] = 'Seleccione un proveedor.';
    }

    if (this.selectedPedido.id_videojuego_plataforma === -1) {
      this.validationMessages['id_videojuego_plataforma'] = 'Seleccione un videojuego plataforma.';
    }

    if (this.selectedPedido.id_sucursal === -1) {
      this.validationMessages['id_sucursal'] = 'Seleccione una sucursal.';
    }

    if (this.selectedPedido.estado === '') {
      this.validationMessages['estado'] = 'Seleccione un estado.';
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
      return;
    }

    this.selectedPedido.total = this.calculateTotal(); // Actualizar total antes de guardar

    if (this.isEditing && this.selectedPedido.id_pedido) {
      this.pedidoService.updatePedido(this.selectedPedido.id_pedido, this.selectedPedido).subscribe(() => {
        this.getPedidos();
        this.isFormVisible = false;
        this.selectedPedido = this.initializePedido();
      });
    } else {
      // Validar si el ID del nuevo pedido ya existe
      if (this.pedidos.some(p => p.id_pedido === this.selectedPedido.id_pedido)) {
        alert('El ID del pedido ya existe.');
        return;
      }
      this.pedidoService.addPedido(this.selectedPedido).subscribe(() => {
        this.getPedidos();
        this.isFormVisible = false;
        this.selectedPedido = this.initializePedido();
      });
    }
  }

  editPedido(pedido: Pedido): void {
    this.selectedPedido = { ...pedido };
    this.isFormVisible = true;
    this.isEditing = true;
  }

  showInsertForm(): void {
    this.selectedPedido = this.initializePedido();
    this.isFormVisible = true;
    this.isEditing = false;
  }

  deletePedido(id: number): void {
    this.pedidoService.deletePedido(id).subscribe(() => this.getPedidos());
  }

  initializePedido(): Pedido {
    return {
      id_pedido: null,
      id_proveedor: -1,
      id_videojuego_plataforma: -1,
      id_sucursal: -1,
      precio_unitario: null,
      cantidad: null,
      descuento: null,
      total: null,
      estado: ''
    };
  }

  closeModal(): void {
    this.isFormVisible = false;
    this.selectedPedido = this.initializePedido();
  }
}
