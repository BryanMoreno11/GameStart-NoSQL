export interface ApiEmpleado {
  ID_EMPLEADO: number;
  ID_SUCURSAL: number;
  ID_CIUDAD: number;
  ID_PUESTO: number;
  CEDULA: string;
  NOMBRE: string;
  FECHA_NACIMIENTO: string;
  DIRECCION: string;
  TELEFONO: string;
  CORREO: string;
  ESTADO: string;
  FECHA_CREACION: string;
}

export interface Empleado {
  id_empleado?: number | null;
  id_sucursal: number | null;
  id_ciudad: number | null;
  id_puesto: number | null;
  cedula: string;
  nombre: string;
  fecha_nacimiento: any | null;
  direccion: string;
  telefono: string;
  correo: string;
  estado: string;
  fecha_creacion?: Date | null;
}
