import { Component, OnInit } from '@angular/core';
import {Chart, registerables} from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Auditoria, DashboardService, Tabla } from '../../services/dashboard.service';
import jsPDF from 'jspdf';
import { FormsModule } from '@angular/forms';
Chart.register(...registerables);
Chart.register(ChartDataLabels);
Chart.defaults.set('plugins.datalabels', {
  color: 'black',
  align: 'end',
  font: {
      weight: 'bold'
  }
});
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export default class DashboardComponent {
  //#region variables
chart:any;
today = new Date();
maxDate=this.formatearFecha(this.today);
//atributos para la tabla auditoria
auditoria:Auditoria={
 tabla:"plataforma",
 fecha_input: "2024-07-20"
};

tabla:Tabla={
 fecha_input: "2024-07-20"

}

videojuegosVentas:any;
videojuegosRecaudacion:any;
generosVentas:any;
generosRecaudacion:any;
plataformasVentas:any;
plataformasRecaudacion:any;
proveedoresVentas:any;
proveedoresRecaudacion:any
tablas:any;
operacionesTablas:any;
//Métodos
constructor(private dashboard_service:DashboardService){

}

ngOnInit():void{
 //Obtener data
 this.dashboard_service.getVideojuegosVentas().subscribe(res=>{
   this.videojuegosVentas= res;
   this.graficoVideojuegosVentas();
 });

 this.dashboard_service.getVideojuegosRecaudacion().subscribe(res=>{
   this.videojuegosRecaudacion= res;
   this.graficoVideojuegosRecaudacion();
   console.log(this.videojuegosRecaudacion)
 });

 this.dashboard_service.getGenerosVentas().subscribe(
   res=>{
     this.generosVentas=res;
     this.graficoGeneroVentas();
     console.log(this.generosVentas);
   }
 );

 this.dashboard_service.getGenerosRecaudacion().subscribe(
   res=>{
     this.generosRecaudacion=res;
     this.graficoGeneroRecaudacion();
   }

 );

 this.dashboard_service.getPlataformasVentas().subscribe(
   res=>{
     this.plataformasVentas=res;
     this.graficoPlataformasVentas();
   }
 );

 this.dashboard_service.getPlataformasRecaudacion().subscribe(
   res=>{
     this.plataformasRecaudacion=res;
     this.graficoPlataformasRecaudacion();
   }
 );

 this.dashboard_service.getCantidadProveedor().subscribe(
   res=>{
     this.proveedoresVentas=res;
     this.graficoProveedoresVentas();
   }

 );

 this.dashboard_service.getRecaudacionProveedor().subscribe(
   res=>{
     this.proveedoresRecaudacion=res;
     this.graficoProveedoresRecaudacion();
   }

 );

 this.dashboard_service.getTablas(this.tabla).subscribe(
   res=>{
     console.log("el resultado es ", res)
     this.tablas=res;
     this.dashboard_service.getOperacionesTablas(this.auditoria).subscribe(
       res=>{
         this.operacionesTablas=res;
         this.graficoOperacionesTabla();
       }
     );
   }
 );


}



change(){
 this.dashboard_service.getOperacionesTablas(this.auditoria).subscribe(
   res=>{
     this.operacionesTablas=res;
     this.graficoOperacionesTabla();
   }
 );
}

changeFecha(){
 this.tabla.fecha_input= this.auditoria.fecha_input;
 this.dashboard_service.getTablas(this.tabla).subscribe(
   res=>{
     this.tablas=res;
     console.log("las tablas luego de cambiar la fecha", this.tablas)
     this.dashboard_service.getOperacionesTablas(this.auditoria).subscribe(
       res=>{
         this.operacionesTablas=res;
         this.graficoOperacionesTabla();
       }
     );
   }
 );
}





formatearFecha(fecha:Date):string{
 let yyyy = fecha.getFullYear();
 let mm = String(fecha.getMonth() + 1).padStart(2, '0'); // Los meses empiezan desde 0
 let dd = String(fecha.getDate()).padStart(2, '0');
 return `${yyyy}-${mm}-${dd}`

}

saveAsPDF() {

 let index = 1;
 let pdf = new jsPDF({
     orientation: 'landscape',
     unit: 'px',
     format: 'a4',
     compress: true,
 })
 const canvas = document.querySelectorAll("canvas");
 let pageWidth = 400;
 let pageHeight = 400;
 index = 1;
 canvas.forEach((canva) => {
     pdf.addImage(canva, 'PNG', 10, 10, pageWidth, pageHeight, `img${index}`, "FAST");
     if (index < canvas.length) {
         pdf.addPage();
     }
     index++;
 });
 pdf.save('Reporte.pdf');
}

//#region graficos

generarColores(longitug:number) {
 var colors = [];
 const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);
 const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;
 for (let i = 0; i < longitug; i++) {
     colors.push(randomRGB());
 }
 return colors;
}


graficoVideojuegosVentas(){
 const videojuegos = Object.keys(this.videojuegosVentas);
 const cantidades = Object.values(this.videojuegosVentas);
 let colores=this.generarColores(cantidades.length);
 const ctx = document.getElementById("VentaVideojuegos") as HTMLCanvasElement;
 var chart = new Chart(ctx, {
   type: 'bar',
   data: {
     labels: videojuegos, 
     datasets: [{
       label: "Videojuegos Ventas",
       data:cantidades, 
       backgroundColor: colores, 
       borderColor: colores,
       borderWidth: 2
     }]
   },
   options: {     
     maintainAspectRatio: false,     

     indexAxis: 'y',

     responsive: true,
     scales: {
       y: {
         beginAtZero: true,
         ticks: {
           font: {
             size:10,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       },
       x: {
         beginAtZero: true,
         ticks: {
           font: {
             size:15,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       }
       
     },
     plugins: {
       datalabels: {
         display: true,

     },
       legend: {
         labels: {
           font: {
             size: 20,
             family:'Verdana',
             weight: 'bold'

         }
         }
       }
       
     }
   }
 });
}

graficoVideojuegosRecaudacion(){
 const videojuegos = Object.keys(this.videojuegosRecaudacion);
 const cantidades = Object.values(this.videojuegosRecaudacion);
 let colores=this.generarColores(cantidades.length);
 const ctx = document.getElementById("RecaudacionVideojuegos") as HTMLCanvasElement;
 var chart = new Chart(ctx, {
   type: 'bar',
   data: {
     labels: videojuegos, 
     datasets: [{
       label: "Videojuegos Recaudación",
       data:cantidades, 
       backgroundColor: colores, 
       borderColor: colores,
       borderWidth: 2
     }]
   },
   options: {
     maintainAspectRatio: false,     
     indexAxis: 'y',

     responsive: true,
     scales: {
       y: {
         beginAtZero: true,
         ticks: {
           font: {
             size:10,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       },
       x: {
         beginAtZero: true,
         ticks: {
           font: {
             size:15,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       }
       
     },
     plugins: {
       datalabels: {
         display: true,
         formatter: function(value, context) {
           // Formatear el valor como moneda
           return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2 });
       }

     },
    
       legend: {
         labels: {
           font: {
             size: 20,
             family:'Verdana',
             weight: 'bold'

         }
         }
       }
       
     }
   }
 });
}

graficoGeneroVentas(){
 const generos = Object.keys(this.generosVentas);
 const cantidades = Object.values(this.generosVentas);
 let colores=this.generarColores(cantidades.length);
 const ctx = document.getElementById("VentaGeneros") as HTMLCanvasElement;
 var myCircleGraph  = new Chart(ctx, {
   type: 'pie',
   data: {
     labels: generos, 
     datasets: [{
       label: "Videojuegos Ventas",
       data:cantidades, 
       backgroundColor: colores, 
       borderColor: colores,
       borderWidth: 2
     }]
   },
   options: {     
     plugins: {    
       title: {
         display: true,
         text: 'Porcentaje de Ventas por Género'
     },
       datalabels: {
         formatter: (value, ctx) => {

           let sum = 0;
           let dataArr = ctx.chart.data.datasets[0].data;
           dataArr.map(data => {
               sum += Number(data);
           });
           let percentage = (value * 100 / sum).toFixed(2) + "%";
           return percentage;


       },
       color: 'black',

     },
     legend: {
       display: true,
       position: "top",
       labels: {
           boxWidth: 10,
       }
   }
       
     }
   }
 });
}


graficoGeneroRecaudacion(){
 const generos = Object.keys(this.generosRecaudacion);
 const cantidades = Object.values(this.generosRecaudacion);
 let colores=this.generarColores(cantidades.length);
 const ctx = document.getElementById("RecaudacionGeneros") as HTMLCanvasElement;
 var myDonutGraph  = new Chart(ctx, {
   type: 'doughnut',
   data: {
     labels: generos, 
     datasets: [{
       label: "Videojuegos Ventas",
       data:cantidades, 
       backgroundColor: colores, 
       borderColor: colores,
       borderWidth: 2
     }]
   },
   options: {     
     plugins: {    
       title: {
         display: true,
         text: 'Porcentaje de Recaudación por Género'
     },
       datalabels: {
         formatter: (value, ctx) => {

           let sum = 0;
           let dataArr = ctx.chart.data.datasets[0].data;
           dataArr.map(data => {
               sum += Number(data);
           });
           let percentage = (value * 100 / sum).toFixed(2) + "%";
           return percentage;


       },
       color: 'black',

     },
     legend: {
       display: true,
       position: "top",
       labels: {
           boxWidth: 10,
       }
   }
       
     }
   }
 });
}

graficoPlataformasVentas(){
 const plataformas = Object.keys(this.plataformasVentas);
 const cantidades = Object.values(this.plataformasVentas);
 let colores=this.generarColores(cantidades.length);
 const ctx = document.getElementById("VentaPlataformas") as HTMLCanvasElement;
 var chart = new Chart(ctx, {
   type: 'bar',
   data: {
     labels: plataformas, 
     datasets: [{
       label:"Ventas por Plataforma",
       data:cantidades, 
       backgroundColor: colores, 
       borderColor: colores,
       borderWidth: 2
     }]
   },
   options: {     
     

     responsive: true,
     scales: {
       y: {
         beginAtZero: true,
         ticks: {
           font: {
             size:10,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       },
       x: {
         beginAtZero: true,
         ticks: {
           font: {
             size:15,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       }
       
     },
     plugins: {
       datalabels: {
         display: true,

     },
       legend: {
         labels: {
           font: {
             size: 20,
             family:'Verdana',
             weight: 'bold'

         }
         }
       }
       
     }
   }
 });
}


graficoPlataformasRecaudacion(){
 const videojuegos = Object.keys(this.plataformasRecaudacion);
 const cantidades = Object.values(this.plataformasRecaudacion);
 let colores=this.generarColores(cantidades.length);
 const ctx = document.getElementById("RecaudacionPlataformas") as HTMLCanvasElement;
 var chart = new Chart(ctx, {
   type: 'bar',
   data: {
     labels: videojuegos, 
     datasets: [{
       label: "Recaudación por Plataforma",
       data:cantidades, 
       backgroundColor: colores, 
       borderColor: colores,
       borderWidth: 2
     }]
   },
   options: {     

     indexAxis: 'y',

     responsive: true,
     scales: {
       y: {
         beginAtZero: true,
         ticks: {
           font: {
             size:10,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       },
       x: {
         beginAtZero: true,
         ticks: {
           font: {
             size:15,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       }
       
     },
     plugins: {
       datalabels: {
         display: true,
         formatter: function(value, context) {
           // Formatear el valor como moneda
           return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2 });
       }
     },
       legend: {
         labels: {
           font: {
             size: 20,
             family:'Verdana',
             weight: 'bold'

         }
         }
       }
       
     }
   }
 });
}

graficoProveedoresRecaudacion(){
 const videojuegos = Object.keys(this.proveedoresRecaudacion);
 const cantidades = Object.values(this.proveedoresRecaudacion);
 let colores=this.generarColores(cantidades.length);
 const ctx = document.getElementById("RecaudacionProveedor") as HTMLCanvasElement;
 var chart = new Chart(ctx, {
   type: 'bar',
   data: {
     labels: videojuegos, 
     datasets: [{
       label: "Recaudación por Proveedor",
       data:cantidades, 
       backgroundColor: colores, 
       borderColor: colores,
       borderWidth: 2
     }]
   },
   options: {     

     indexAxis: 'y',

     responsive: true,
     scales: {
       y: {
         beginAtZero: true,
         ticks: {
           font: {
             size:10,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       },
       x: {
         beginAtZero: true,
         ticks: {
           font: {
             size:15,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       }
       
     },
     plugins: {
       datalabels: {
         display: true,
         formatter: function(value, context) {
           // Formatear el valor como moneda
           return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2 });
       }
     },
       legend: {
         labels: {
           font: {
             size: 20,
             family:'Verdana',
             weight: 'bold'

         }
         }
       }
       
     }
   }
 });
}

graficoProveedoresVentas(){
 const plataformas = Object.keys(this.proveedoresVentas);
 const cantidades = Object.values(this.proveedoresVentas);
 let colores=this.generarColores(cantidades.length);
 const ctx = document.getElementById("CantidadProveedor") as HTMLCanvasElement;
 var chart = new Chart(ctx, {
   type: 'bar',
   data: {
     labels: plataformas, 
     datasets: [{
       label:"Ventas por Proveedor",
       data:cantidades, 
       backgroundColor: colores, 
       borderColor: colores,
       borderWidth: 2
     }]
   },
   options: {     
     

     responsive: true,
     scales: {
       y: {
         beginAtZero: true,
         ticks: {
           font: {
             size:10,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       },
       x: {
         beginAtZero: true,
         ticks: {
           font: {
             size:15,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       }
       
     },
     plugins: {
       datalabels: {
         display: true,

     },
       legend: {
         labels: {
           font: {
             size: 20,
             family:'Verdana',
             weight: 'bold'

         }
         }
       }
       
     }
   }
 });
}

graficoOperacionesTabla(){
 if (this.chart) {
   this.chart.destroy();
 }
 const operaciones = Object.keys(this.operacionesTablas);
 const cantidades = Object.values(this.operacionesTablas);
 let colores=this.generarColores(cantidades.length);
 const ctx = document.getElementById("OperacionesTablas") as HTMLCanvasElement;
 this.chart = new Chart(ctx, {
   type: 'bar',
   data: {
     labels: operaciones, 
     datasets: [{
       label:"Estadísticas de Auditoría",
       data:cantidades, 
       backgroundColor: colores, 
       borderColor: colores,
       borderWidth: 2
     }]
   },
   options: {     
     
     maintainAspectRatio: false,     

     responsive: true,
     scales: {
       y: {
         beginAtZero: true,
         ticks: {
           font: {
             size:10,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       },
       x: {
         beginAtZero: true,
         ticks: {
           font: {
             size:15,
             family: 'Verdana',
             weight: 'bold'
           }
         }
       }
       
     },
     plugins: {
       datalabels: {
         display: true,

     },
       legend: {
         labels: {
           font: {
             size: 20,
             family:'Verdana',
             weight: 'bold'

         }
         }
       }
       
     }
   }
 });
}
}
