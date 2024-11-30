export interface ApiPedido {
    ID_PEDIDO: number;
    ID_PROVEEDOR: number;
    ID_VIDEOJUEGO_PLATAFORMA: number;
    ID_SUCURSAL: number;
    FECHA_PEDIDO: string;
    PRECIO_UNITARIO: number;
    CANTIDAD: number;
    DESCUENTO: number;
    TOTAL: number;
    ESTADO: string;
  }
  
  export interface Pedido {
    id_pedido?: number | null;
    id_proveedor: number | null;
    id_videojuego_plataforma: number | null;
    id_sucursal: number | null;
    fecha_pedido?: Date | null;
    precio_unitario: number | null;
    cantidad: number | null;
    descuento: number | null;
    total: number | null;
    estado: string | null;
  }
  