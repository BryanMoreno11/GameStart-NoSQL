import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VideojuegosService {

  constructor(private http: HttpClient) { }

  videojuegos = [
    {
      ID_VIDEOJUEGO_PLATAFORMA:1,
      TITULO: 'The Legend of Zelda: Breath of the Wild',
      PRECIO: 59.99,
      NOMBRE_PLATAFORMA: 'Nintendo Switch',
      STOCK: 10,
      GENEROS: ['Aventura', 'Acción'],
      NOMBRE_DESARROLLADORA: 'Nintendo',
      DESCRIPCION_VIDEOJUEGO: 'Explora el vasto mundo abierto de Hyrule en esta emocionante aventura.',
      IMAGEN: ['https://media.gamestop.com/i/gamestop/10141904/The-Legend-of-Zelda-Breath-of-the-Wild---Nintendo-Switch?$pdp2x$',
        'https://media.gamestop.com/i/gamestop/10131600_10141904_10162391_SCR23/The-Legend-of-Zelda-Breath-of-the-Wild---Nintendo-Switch?$screen2x$',
        'https://media.gamestop.com/i/gamestop/10131600_10141904_10162391_SCR22/The-Legend-of-Zelda-Breath-of-the-Wild---Nintendo-Switch?$screen2x$',
        'https://media.gamestop.com/i/gamestop/10131600_10141904_10162391_SCR21/The-Legend-of-Zelda-Breath-of-the-Wild---Nintendo-Switch?$screen2x$'
      ]
    },
    {
      ID_VIDEOJUEGO_PLATAFORMA:2,
      TITULO: 'God of War Ragnarok',
      PRECIO: 69.99,
      NOMBRE_PLATAFORMA: 'PlayStation 5',
      STOCK: 5,
      GENEROS: ['Acción', 'Aventura'],
      NOMBRE_DESARROLLADORA: 'Santa Monica Studio',
      DESCRIPCION_VIDEOJUEGO: 'Acompaña a Kratos y Atreus en un viaje épico lleno de acción y emociones.',
      IMAGEN: ['https://media.gamestop.com/i/gamestop/10131619/God-of-War---PlayStation-4?$pdp$$&fmt=webp',
        'https://media.gamestop.com/i/gamestop/10131619_10158235_10158429_10160941_SCR13/God-of-War---PlayStation-4?$screen2x$',
        'https://media.gamestop.com/i/gamestop/10131619_10158235_10158429_10160941_SCR12/God-of-War---PlayStation-4?$screen$$&fmt=webp',
        'https://media.gamestop.com/i/gamestop/10131619_10158235_10158429_10160941_SCR10/God-of-War---PlayStation-4?$screen$$&fmt=webp'
      ]
    },
    {
      ID_VIDEOJUEGO_PLATAFORMA:3,
      TITULO: 'Halo Infinite',
      PRECIO: 49.99,
      NOMBRE_PLATAFORMA: 'Xbox Series X',
      STOCK: 8,
      GENEROS: ['Acción', 'FPS'],
      NOMBRE_DESARROLLADORA: '343 Industries',
      DESCRIPCION_VIDEOJUEGO: 'El Jefe Maestro regresa en una épica batalla para salvar la humanidad.',
      IMAGEN:['https://media.gamestop.com/i/gamestop/11108375/Halo-Infinite---Xbox-Series-X?$pdp2x$',
        'https://media.gamestop.com/i/gamestop/11108375_SCR11/Halo-Infinite---Xbox-Series-X?$screen2x$',
        'https://media.gamestop.com/i/gamestop/11108375_SCR10/Halo-Infinite---Xbox-Series-X?$screen2x$',
        'https://media.gamestop.com/i/gamestop/11108375_SCR09/Halo-Infinite---Xbox-Series-X?$screen$$&fmt=webp'
      ]
    },

    {
      ID_VIDEOJUEGO_PLATAFORMA:4,
      TITULO: 'Elden Ring',
      PRECIO: 59.99,
      NOMBRE_PLATAFORMA: 'PlayStation 5',
      STOCK: 12,
      GENEROS: ['Acción', 'RPG'],
      NOMBRE_DESARROLLADORA: 'FromSoftware',
      DESCRIPCION_VIDEOJUEGO: 'Explora un vasto mundo lleno de misterios y enemigos formidables en esta nueva aventura de FromSoftware.',
      IMAGEN: [
        'https://media.gamestop.com/i/gamestop/11148586/Elden-Ring----PlayStation-5?$pdp$$&fmt=webp',
        'https://media.gamestop.com/i/gamestop/11148586_SCR16/Elden-Ring----PlayStation-5?$screen2x$',
        'https://media.gamestop.com/i/gamestop/11148586_SCR15/Elden-Ring----PlayStation-5?$screen2x$',
        'https://media.gamestop.com/i/gamestop/11148586_SCR14/Elden-Ring----PlayStation-5?$screen2x$'
      ]
    },
    {
      ID_VIDEOJUEGO_PLATAFORMA:5,
      TITULO: 'Spider-Man: Miles Morales',
      PRECIO: 49.99,
      NOMBRE_PLATAFORMA: 'PlayStation 5',
      STOCK: 15,
      GENEROS: ['Acción', 'Aventura'],
      NOMBRE_DESARROLLADORA: 'Insomniac Games',
      DESCRIPCION_VIDEOJUEGO: 'Conviértete en Miles Morales y domina nuevos poderes arácnidos mientras proteges la ciudad de Nueva York.',
      IMAGEN: [
        'https://media.gamestop.com/i/gamestop/11108199/Marvels-Spider-Man-Miles-Morales?$pdp2x$',
        'https://media.gamestop.com/i/gamestop/11108199_11108812_SCR09/Marvels-Spider-Man-Miles-Morales?$screen2x$',
        'https://media.gamestop.com/i/gamestop/11108199_11108812_SCR08/Marvels-Spider-Man-Miles-Morales?$screen2x$',
        'https://media.gamestop.com/i/gamestop/11108199_11108812_SCR07/Marvels-Spider-Man-Miles-Morales?$screen$$&fmt=webp'
      ]
    },
    {
      ID_VIDEOJUEGO_PLATAFORMA:6,
      TITULO: 'Red Dead Redemption 2',
      PRECIO: 39.99,
      NOMBRE_PLATAFORMA: 'PlayStation 4',
      STOCK: 20,
      GENEROS: ['Aventura', 'Acción', 'Western'],
      NOMBRE_DESARROLLADORA: 'Rockstar Games',
      DESCRIPCION_VIDEOJUEGO: 'Sumérgete en el Salvaje Oeste con Arthur Morgan y la pandilla Van der Linde.',
      IMAGEN: [
        'https://media.gamestop.com/i/gamestop/10138091?$pdp2x$',
        'https://media.gamestop.com/i/gamestop/10138091_10138093_10162932_10162935_10162941_10162943_SCR07?$screen2x$',
        'https://media.gamestop.com/i/gamestop/10138091_10138093_10162932_10162935_10162941_10162943_SCR06?$screen2x$',
        'https://media.gamestop.com/i/gamestop/10138091_10138093_10162932_10162935_10162941_10162943_SCR05?$screen2x$'
      ]
    },
    {
      ID_VIDEOJUEGO_PLATAFORMA:7,
      TITULO: 'Cyberpunk 2077',
      PRECIO: 29.99,
      NOMBRE_PLATAFORMA: 'PlayStation 5',
      STOCK: 25,
      GENEROS: ['RPG', 'Ciencia Ficción'],
      NOMBRE_DESARROLLADORA: 'CD Projekt Red',
      DESCRIPCION_VIDEOJUEGO: 'Explora Night City, una ciudad futurista llena de tecnología, intrigas y peligro.',
      IMAGEN: [
        'https://media.gamestop.com/i/gamestop/10178511-420e9e56?$pdp2x$',
        'https://media.gamestop.com/i/gamestop/10178511-420e9e56_SCR01?$screen$$&fmt=webp',
        'https://media.gamestop.com/i/gamestop/10178511-420e9e56_SCR02?$screen2x$',
        'https://media.gamestop.com/i/gamestop/10178511-420e9e56_SCR03?$screen2x$'
      ]
    }



  ];

  getVideojuegos() {
    return this.videojuegos;
  }

  getVideojuego(id:number){
    return this.videojuegos.find(videojuego=> videojuego.ID_VIDEOJUEGO_PLATAFORMA==id);
  }

 
}




