import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductosService, Producto } from '../../services/productos.service';
import { PlataformaService, Plataforma } from '../../services/plataforma.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-productos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-productos.component.html',
  styleUrls: ['./admin-productos.component.css']
})
export default class AdminProductosComponent implements OnInit {
  productos: Producto[] = [];
  filteredProductos: Producto[] = [];
  plataformas: Plataforma[] = [];

  // Filtros
  searchName: string = '';
  filterType: string = '';
  filterPlatform: string = '';

  // Para formulario (crear/editar)
  selectedProducto: Producto = this.initializeProducto();
  isFormVisible: boolean = false;
  isEditing: boolean = false;

  constructor(
    private productosService: ProductosService,
    private plataformaService: PlataformaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getProductos();
    this.getPlataformas();
  }

  getProductos(): void {
    this.productosService.getProductos().subscribe(prod => {
      this.productos = prod;
      this.filteredProductos = prod;
      this.cdr.detectChanges();
    });
  }

  getPlataformas(): void {
    this.plataformaService.getPlataformas().subscribe(plat => {
      this.plataformas = plat;
      this.cdr.detectChanges();
    });
  }

  applyFilter(): void {
    this.filteredProductos = this.productos.filter(prod => {
      const matchesName = prod.nombre.toLowerCase().includes(this.searchName.toLowerCase());
      const matchesType = this.filterType ? prod.tipo?.nombre.toLowerCase() === this.filterType.toLowerCase() : true;
      const matchesPlatform = this.filterPlatform ? prod.plataforma?.nombre.toLowerCase() === this.filterPlatform.toLowerCase() : true;
      return matchesName && matchesType && matchesPlatform;
    });
  }

  showInsertForm(): void {
    this.selectedProducto = this.initializeProducto();
    this.isFormVisible = true;
    this.isEditing = false;
  }

  editProducto(producto: Producto): void {
    // Clonamos el producto para evitar mutaciones directas
    this.selectedProducto = { ...producto };
    this.isFormVisible = true;
    this.isEditing = true;
  }

  saveProducto(): void {
    if (this.isEditing && this.selectedProducto._id) {
      Swal.fire({
        title: 'Confirmar actualización',
        text: '¿Desea actualizar el producto?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.productosService.updateProducto(this.selectedProducto._id, this.selectedProducto)
            .subscribe(() => {
              Swal.fire('Actualizado', 'Producto actualizado exitosamente', 'success');
              this.getProductos();
              this.isFormVisible = false;
              this.selectedProducto = this.initializeProducto();
            });
        }
      });
    } else {
      Swal.fire({
        title: 'Confirmar inserción',
        text: '¿Desea agregar el nuevo producto?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.productosService.createProducto(this.selectedProducto)
            .subscribe(() => {
              Swal.fire('Agregado', 'Producto agregado exitosamente', 'success');
              this.getProductos();
              this.isFormVisible = false;
              this.selectedProducto = this.initializeProducto();
            });
        }
      });
    }
  }

  deleteProducto(id: string): void {
    Swal.fire({
      title: '¿Está seguro?',
      text: "Esta acción no se puede deshacer.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.productosService.deleteProducto(id).subscribe(() => {
          Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
          this.getProductos();
        });
      }
    });
  }

  viewKeys(producto: Producto): void {
    if (producto.claves_digitales && producto.claves_digitales.length > 0) {
      let keysHtml = `<table class="keys-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Válido</th>
            </tr>
          </thead>
          <tbody>`;
      producto.claves_digitales.forEach(key => {
        keysHtml += `<tr>
            <td>${key.codigo}</td>
            <td>${key.valido ? 'Válido' : 'No válido'}</td>
          </tr>`;
      });
      keysHtml += `</tbody></table>`;
      Swal.fire({
        title: 'Claves del Producto',
        html: keysHtml,
        width: '600px'
      });
    } else {
      Swal.fire('Sin claves', 'Este producto no tiene claves generadas', 'info');
    }
  }

  // Actualizar stock usando SweetAlert2 para solicitar el nuevo valor
  changeStock(producto: Producto): void {
    Swal.fire({
      title: 'Cambiar Stock',
      input: 'number',
      inputLabel: 'Ingrese la cantidad de claves no usadas (nuevo stock)',
      inputValue: producto.stock,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || Number(value) < 0) {
          return 'Debe ingresar un número válido';
        }
        return null;
      }    }).then((result) => {
      if (result.isConfirmed) {
        const newStock = Number(result.value);
        this.productosService.updateStockProducto(producto._id, newStock).subscribe(() => {
          Swal.fire('Actualizado', 'El stock ha sido actualizado', 'success');
          this.getProductos();
        });
      }
    });
  }

  closeModal(): void {
    this.isFormVisible = false;
    this.selectedProducto = this.initializeProducto();
  }

  onModalClick(event: MouseEvent): void {
  // Si el click se hizo sobre el contenedor (y no en su contenido)
  if (event.target === event.currentTarget) {
    this.closeModal();
  }
}

  initializeProducto(): Producto {
    return {
      _id: '',
      nombre: '',
      desarrolladora: '',
      plataforma: { nombre: '', descripcion: '', fecha_creacion: '' },
      genero: { nombre: '', descripcion: '', fecha_creacion: '' },
      tipo: { nombre: '', descripcion: '', fecha_creacion: '' },
      precio: 0,
      stock: 0,
      imagenes: [],
      fecha_creacion: new Date().toISOString().split('T')[0],
      descripcion: '',
      claves_digitales: null
    };
  }
}
