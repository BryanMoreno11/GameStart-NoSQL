import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { DashboardService } from '../../services/dashboard.service';
import jsPDF from 'jspdf';

Chart.register(...registerables);
Chart.register(ChartDataLabels);
Chart.defaults.set('plugins.datalabels', {
  color: 'black',
  align: 'end',
  font: {
    weight: 'bold',
  },
});

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // Variables para almacenar los datos
  videojuegosVentas: any;
  videojuegosRecaudacion: any;
  generosVentas: any;
  generosRecaudacion: any;
  plataformasVentas: any;
  plataformasRecaudacion: any;
  proveedoresVentas: any;
  proveedoresRecaudacion: any;
  cantidadVentasFormato: any;
  recaudacionFormato: any;
  estadisticasGenerales: any;


  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Obtener datos y renderizar gráficos
    this.dashboardService.getVideojuegosVentas().subscribe((res) => {
      this.videojuegosVentas = res;
      this.graficoVideojuegosVentas();
    });

    this.dashboardService.getVideojuegosRecaudacion().subscribe((res) => {
      this.videojuegosRecaudacion = res;
      this.graficoVideojuegosRecaudacion();
    });

    this.dashboardService.getGenerosVentas().subscribe((res) => {
      this.generosVentas = res;
      this.graficoGeneroVentas();
    });

    this.dashboardService.getGenerosRecaudacion().subscribe((res) => {
      this.generosRecaudacion = res;
      this.graficoGeneroRecaudacion();
    });

    this.dashboardService.getPlataformasVentas().subscribe((res) => {
      this.plataformasVentas = res;
      this.graficoPlataformasVentas();
    });

    this.dashboardService.getPlataformasRecaudacion().subscribe((res) => {
      this.plataformasRecaudacion = res;
      this.graficoPlataformasRecaudacion();
    });

    this.dashboardService.getCantidadProveedor().subscribe((res) => {
      this.proveedoresVentas = res;
      this.graficoProveedoresVentas();
    });

    this.dashboardService.getRecaudacionProveedor().subscribe((res) => {
      this.proveedoresRecaudacion = res;
      this.graficoProveedoresRecaudacion();
    });

    this.dashboardService.getCantidadVentasFormato().subscribe((res) => {
      this.cantidadVentasFormato = res;
      this.graficoCantidadVentasFormato();
    });

    this.dashboardService.getRecaudacionFormato().subscribe((res) => {
      this.recaudacionFormato = res;
      this.graficoRecaudacionFormato();
    });

    this.dashboardService.getEstadisticasGenerales().subscribe((res) => {
      this.estadisticasGenerales = res;
      this.dibujarResumenEstadisticas();
    });
  }

  // Métodos para generar gráficos
  generarColores(longitud: number) {
    const colors = [];
    const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
    const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;
    for (let i = 0; i < longitud; i++) {
      colors.push(randomRGB());
    }
    return colors;
  }

  graficoVideojuegosVentas() {
    const videojuegos = Object.keys(this.videojuegosVentas);
    const cantidades = Object.values(this.videojuegosVentas);
    const colores = this.generarColores(cantidades.length);
    const ctx = document.getElementById('VentaVideojuegos') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: videojuegos,
        datasets: [
          {
            label: 'Ventas por Videojuego',
            data: cantidades,
            backgroundColor: colores,
            borderColor: colores,
            borderWidth: 2,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          datalabels: {
            display: true,
          },
        },
      },
    });
  }

  graficoVideojuegosRecaudacion() {
    const videojuegos = Object.keys(this.videojuegosRecaudacion);
    const recaudaciones = Object.values(this.videojuegosRecaudacion);
    const colores = this.generarColores(recaudaciones.length);
    const ctx = document.getElementById('RecaudacionVideojuegos') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: videojuegos,
        datasets: [
          {
            label: 'Recaudación por Videojuego',
            data: recaudaciones,
            backgroundColor: colores,
            borderColor: colores,
            borderWidth: 2,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          datalabels: {
            display: true,
            formatter: (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          },
        },
      },
    });
  }
  
  graficoGeneroVentas() {
    const generos = Object.keys(this.generosVentas);
    const cantidades = Object.values(this.generosVentas);
    const colores = this.generarColores(cantidades.length);
    const ctx = document.getElementById('VentaGeneros') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: generos,
        datasets: [
          {
            label: 'Ventas por Género',
            data: cantidades,
            backgroundColor: colores,
            borderColor: colores,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              const total = ctx.chart.data.datasets[0].data.reduce((a:any, b) => a + b, 0);
              const porcentaje = ((value * 100) / total).toFixed(2) + '%';
              return porcentaje;
            },
            color: 'black',
          },
        },
      },
    });
  }
  
  graficoGeneroRecaudacion() {
    const generos = Object.keys(this.generosRecaudacion);
    const recaudaciones = Object.values(this.generosRecaudacion);
    const colores = this.generarColores(recaudaciones.length);
    const ctx = document.getElementById('RecaudacionGeneros') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: generos,
        datasets: [
          {
            label: 'Recaudación por Género',
            data: recaudaciones,
            backgroundColor: colores,
            borderColor: colores,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              const total = ctx.chart.data.datasets[0].data.reduce((a:any, b) => a + b, 0);
              const porcentaje = ((value * 100) / total).toFixed(2) + '%';
              return porcentaje;
            },
            color: 'black',
          },
        },
      },
    });
  }
  
  graficoPlataformasVentas() {
    const plataformas = Object.keys(this.plataformasVentas);
    const cantidades = Object.values(this.plataformasVentas);
    const colores = this.generarColores(cantidades.length);
    const ctx = document.getElementById('VentaPlataformas') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: plataformas,
        datasets: [
          {
            label: 'Ventas por Plataforma',
            data: cantidades,
            backgroundColor: colores,
            borderColor: colores,
            borderWidth: 2,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          datalabels: {
            display: true,
          },
        },
      },
    });
  }
  
  graficoPlataformasRecaudacion() {
    const plataformas = Object.keys(this.plataformasRecaudacion);
    const recaudaciones = Object.values(this.plataformasRecaudacion);
    const colores = this.generarColores(recaudaciones.length);
    const ctx = document.getElementById('RecaudacionPlataformas') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: plataformas,
        datasets: [
          {
            label: 'Recaudación por Plataforma',
            data: recaudaciones,
            backgroundColor: colores,
            borderColor: colores,
            borderWidth: 2,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          datalabels: {
            display: true,
            formatter: (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          },
        },
      },
    });
  }
  
  graficoProveedoresVentas() {
    const proveedores = Object.keys(this.proveedoresVentas);
    const cantidades = Object.values(this.proveedoresVentas);
    const colores = this.generarColores(cantidades.length);
    const ctx = document.getElementById('CantidadProveedor') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: proveedores,
        datasets: [
          {
            label: 'Ventas por Proveedor',
            data: cantidades,
            backgroundColor: colores,
            borderColor: colores,
            borderWidth: 2,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          datalabels: {
            display: true,
          },
        },
      },
    });
  }
  
  graficoProveedoresRecaudacion() {
    const proveedores = Object.keys(this.proveedoresRecaudacion);
    const recaudaciones = Object.values(this.proveedoresRecaudacion);
    const colores = this.generarColores(recaudaciones.length);
    const ctx = document.getElementById('RecaudacionProveedor') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: proveedores,
        datasets: [
          {
            label: 'Recaudación por Proveedor',
            data: recaudaciones,
            backgroundColor: colores,
            borderColor: colores,
            borderWidth: 2,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          datalabels: {
            display: true,
            formatter: (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
          },
        },
      },
    });
  }
  
  graficoCantidadVentasFormato() {
    const formatos = Object.keys(this.cantidadVentasFormato);
    const cantidades = Object.values(this.cantidadVentasFormato);
    const colores = this.generarColores(cantidades.length);
    const ctx = document.getElementById('CantidadVentasFormato') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie', // Cambiado a gráfico de pastel
      data: {
        labels: formatos,
        datasets: [
          {
            label: 'Ventas por Formato',
            data: cantidades,
            backgroundColor: colores,
            borderColor: colores,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              const total = ctx.chart.data.datasets[0].data.reduce((a:any, b) => a + b, 0);
              const porcentaje = ((value * 100) / total).toFixed(2) + '%';
              return porcentaje;
            },
            color: 'black',
          },
        },
      },
    });
  }
  
  graficoRecaudacionFormato() {
    const formatos = Object.keys(this.recaudacionFormato);
    const recaudaciones = Object.values(this.recaudacionFormato);
    const colores = this.generarColores(recaudaciones.length);
    const ctx = document.getElementById('RecaudacionFormato') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'pie', // Cambiado a gráfico de pastel
      data: {
        labels: formatos,
        datasets: [
          {
            label: 'Recaudación por Formato',
            data: recaudaciones,
            backgroundColor: colores,
            borderColor: colores,
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          datalabels: {
            formatter: (value, ctx) => {
              const total = ctx.chart.data.datasets[0].data.reduce((a:any, b) => a + b, 0);
              const porcentaje = ((value * 100) / total).toFixed(2) + '%';
              return porcentaje;
            },
            color: 'black',
          },
        },
      },
    });
  }




  
  dibujarResumenEstadisticas() {
    const canvas = document.getElementById('ResumenEstadisticas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Estilos
    const backgroundColor = '#ffffff';
    const textColor = '#333333';
    const headerColor = '#095493';
    const rowColor1 = '#f9f9f9';
    const rowColor2 = '#ffffff';
    const padding = 20;
    const rowHeight = 40;
    const fontSize = 16;

    // Dibujar fondo
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar encabezado
    ctx.fillStyle = headerColor;
    ctx.fillRect(0, 0, canvas.width, rowHeight);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('Resumen General', canvas.width / 2, rowHeight / 1.5);

    // Datos de la tabla
    const datos = [
      { label: 'Dinero Recaudado', value: `$${this.estadisticasGenerales.dineroRecaudado.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
      { label: 'Usuarios Registrados', value: this.estadisticasGenerales.usuariosRegistrados },
      { label: 'Cantidad de Ventas', value: this.estadisticasGenerales.cantidadVentas },
      { label: 'Número de Empleados', value: this.estadisticasGenerales.numeroEmpleados },
      { label: 'Videojuegos Disponibles', value: this.estadisticasGenerales.cantidadVideojuegos },
      { label: 'Videojuegos Físicos', value: this.estadisticasGenerales.videojuegosFisico },
      { label: 'Videojuegos Digitales', value: this.estadisticasGenerales.videojuegosDigital },
      { label: 'Dinero Invertido', value: `$${this.estadisticasGenerales.dineroInvertido.toLocaleString('en-US', { minimumFractionDigits: 2 })}` },
    ];

    // Dibujar filas de la tabla
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'left';

    datos.forEach((item, index) => {
      const y = rowHeight + index * rowHeight;

      // Alternar colores de fila
      ctx.fillStyle = index % 2 === 0 ? rowColor1 : rowColor2;
      ctx.fillRect(0, y, canvas.width, rowHeight);

      // Dibujar texto
      ctx.fillStyle = textColor;
      ctx.fillText(item.label, padding, y + rowHeight / 1.5);

      ctx.fillStyle = headerColor;
      ctx.textAlign = 'right';
      ctx.fillText(item.value, canvas.width - padding, y + rowHeight / 1.5);
      ctx.textAlign = 'left';
    });

    // Dibujar bordes
    ctx.strokeStyle = '#dddddd';
    ctx.beginPath();
    ctx.moveTo(0, rowHeight);
    ctx.lineTo(canvas.width, rowHeight);
    datos.forEach((_, index) => {
      const y = rowHeight + index * rowHeight;
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    });
    ctx.stroke();
  }

  
  // Guardar como PDF
  saveAsPDF() {
    const pdf = new jsPDF('landscape', 'px', 'a4');
    const canvas = document.querySelectorAll('canvas');
    canvas.forEach((canva, index) => {
      const img = canva.toDataURL('image/png');
      pdf.addImage(img, 'PNG', 10, 10, 400, 400, `img${index}`, 'FAST');
      if (index < canvas.length - 1) pdf.addPage();
    });
    pdf.save('Reporte.pdf');
  }
}