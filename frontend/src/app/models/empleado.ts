export interface Puesto {
  _id?: string;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: string;
}

export interface Empleado {
  _id?: string;
  cedula: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  direccion: string;
  telefono: string;
  correo: string;
  puesto: Puesto;
  sueldo: number;
  fecha_creacion: string;
  estado?: string;
}
