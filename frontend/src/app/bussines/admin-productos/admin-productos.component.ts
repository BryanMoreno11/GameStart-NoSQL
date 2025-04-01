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

  // Diccionario para índices del carrusel: productId -> índice actual
  carouselIndex: { [productId: string]: number } = {};

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

      // Asegurar índices de carrusel en 0 para cada producto
      prod.forEach((p) => {
        if (!this.carouselIndex[p._id]) {
          this.carouselIndex[p._id] = 0;
        }
      });

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
      const matchesType = this.filterType
        ? prod.tipo?.nombre.toLowerCase() === this.filterType.toLowerCase()
        : true;
      const matchesPlatform = this.filterPlatform
        ? prod.plataforma?.nombre.toLowerCase() === this.filterPlatform.toLowerCase()
        : true;

      return matchesName && matchesType && matchesPlatform;
    });
  }

  showInsertForm(): void {
    this.selectedProducto = this.initializeProducto();
    this.isFormVisible = true;
    this.isEditing = false;
  }

  comparePlatforms(p1: any, p2: any): boolean {
    return p1?.nombre === p2?.nombre;
  }

  editProducto(producto: Producto): void {
    this.selectedProducto = {
      ...producto,
      plataforma: { ...producto.plataforma },
      genero: { ...producto.genero },
      tipo: { ...producto.tipo },
      imagenes: [...(producto.imagenes || [])]
    };
    this.isFormVisible = true;
    this.isEditing = true;
  }

  // Métodos para el mini carrusel
  nextImage(producto: Producto): void {
    if (!producto.imagenes || !producto.imagenes.length) return;
    const current = this.carouselIndex[producto._id] || 0;
    const total = producto.imagenes.length;
    // Avanzar índice
    const next = (current + 1) % total;
    this.carouselIndex[producto._id] = next;
  }

  prevImage(producto: Producto): void {
    if (!producto.imagenes || !producto.imagenes.length) return;
    const current = this.carouselIndex[producto._id] || 0;
    const total = producto.imagenes.length;
    // Retroceder índice (con wrap)
    const prev = (current - 1 + total) % total;
    this.carouselIndex[producto._id] = prev;
  }

  // Nueva función para editar una clave digital específica (ejemplo)
  editClaves(producto: Producto): void {
    if (!producto.claves_digitales || producto.claves_digitales.length === 0) {
      Swal.fire('Sin claves', 'Este producto no tiene claves digitales asignadas.', 'info');
      return;
    }
    // Mostrar las claves actuales separadas por coma
    const clavesActuales = producto.claves_digitales.join(', ');
    // Primero, solicitar el índice de la clave a modificar:
    Swal.fire({
      title: 'Editar Clave Digital',
      input: 'number',
      inputLabel: 'Ingrese el índice de la clave que desea modificar (0 a ' + (producto.claves_digitales.length - 1) + ')',
      inputPlaceholder: 'Ejemplo: 0',
      showCancelButton: true,
      inputValidator: (value) => {
        if (value === '' || isNaN(Number(value))) {
          return 'Debe ingresar un número válido';
        }
        const idx = Number(value);
        if (idx < 0 || idx >= (producto.claves_digitales?.length || 0)) {
          return 'El índice está fuera de rango';
        }
        return null;
      }
    }).then((indiceResult) => {
      if (indiceResult.isConfirmed) {
        const index = Number(indiceResult.value);
        // Ahora solicita el nuevo valor para la clave seleccionada
        Swal.fire({
          title: 'Nueva clave',
          input: 'text',
          inputLabel: 'Ingrese el nuevo valor para la clave',
          inputValue: producto.claves_digitales?.[index] ?? '',
          showCancelButton: true,
          inputValidator: (value) => {
            if (!value || value.trim() === '') {
              return 'La clave no puede estar vacía';
            }
            return null;
          }
        }).then((claveResult) => {
          if (claveResult.isConfirmed) {
            const newClave = claveResult.value.trim();
            this.productosService.updateClaveProducto(producto._id, index, newClave)
              .subscribe(() => {
                Swal.fire('Actualizado', 'La clave digital ha sido actualizada', 'success');
                this.getProductos();
              }, error => {
                Swal.fire('Error', 'No se pudo actualizar la clave', 'error');
              });
          }
        });
      }
    });  }

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
      text: 'Esta acción no se puede deshacer.',
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
    if (producto.tipo?.nombre && producto.tipo.nombre.toLowerCase() === 'digital' &&
        producto.claves_digitales && producto.claves_digitales.length) {
      const clavesTexto = producto.claves_digitales.join(', ');
      Swal.fire({
        title: 'Claves del Producto',
        html: `<div style="text-align:center; font-size:16px;">${clavesTexto}</div>`,
        width: '600px'
      });
    } else {
      Swal.fire('Sin claves', 'Este producto no tiene claves digitales generadas', 'info');
    }
  }

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
      }
    }).then((result) => {
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

  addImageUrl(): void {
    this.selectedProducto.imagenes.push('');
  }

  removeImageUrl(index: number): void {
    this.selectedProducto.imagenes.splice(index, 1);
  }
}
