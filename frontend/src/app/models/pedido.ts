import { Producto } from "../services/productos.service";

export interface ApiPedido {
  _id: string; // El ID del pedido ahora es un string
  proveedor: {
    _id: string;
    nombre: string;
    celular: string;
    correo: string;
    direccion: string;
    fecha_creacion: string;
  };
  producto: Producto,
  precio_unitario: number;
  cantidad: number;
  descuento: number;
  total: number;
  fecha_pedido: string;
}

export interface Pedido {
  id_pedido: string; // Cambio de número a string
  proveedor: { // Datos del proveedor
    id: string;
    nombre: string;
  };
  producto: { // Datos del producto
    id: string;
    nombre: string;
    plataforma: string;
  };
  precio_unitario: number;
  cantidad: number;
  descuento: number;
  total: number;
  fecha_pedido: Date;
}
