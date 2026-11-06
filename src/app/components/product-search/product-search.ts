import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs/operators';
import { Product } from './product.interface';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-search.html',
  styleUrls: ['./product-search.css']
})
export class ProductSearchComponent implements OnInit {
  
  searchControl = new FormControl('');
  categoryControl = new FormControl('All');
  priceControl = new FormControl(1000);

  products: Product[] = [
    { id: 1, name: 'Silla Ergonómica Moderna', category: 'Muebles', price: 250, description: 'Silla de oficina ajustable con diseño cómodo y moderno.', image: 'https://picsum.photos/id/366/400/300' },
    { id: 2, name: 'Lámpara Colgante Minimalista', category: 'Accesorios', price: 120, description: 'Iluminación elegante para espacios interiores contemporáneos.', image: 'https://picsum.photos/id/175/400/300' },
    { id: 3, name: 'Taza de Cerámica Amarilla', category: 'Accesorios', price: 25, description: 'Taza artesanal para café o té con acabado brillante.', image: 'https://picsum.photos/id/30/400/300' },
    { id: 4, name: 'Tenis Deportivos Nike Air', category: 'Calzado', price: 230, description: 'Calzado deportivo de alto rendimiento y máxima amortiguación.', image: 'https://picsum.photos/id/21/400/300' },
    { id: 5, name: 'Escritorio de Madera Nórdica', category: 'Muebles', price: 450, description: 'Escritorio amplio con cajones integrados y acabado natural.', image: 'https://picsum.photos/id/1075/400/300' },
    { id: 6, name: 'Reloj Inteligente Sport', category: 'Electrónica', price: 199, description: 'Monitorea tu actividad física, ritmo cardíaco y notificaciones.', image: 'https://picsum.photos/id/1062/400/300' },
    { id: 7, name: 'Audífonos Inalámbricos Bluetooth', category: 'Electrónica', price: 150, description: 'Sonido envolvente con cancelación activa de ruido.', image: 'https://picsum.photos/id/2/400/300' },
    { id: 8, name: 'Mochila Urbana Impermeable', category: 'Bolsos', price: 85, description: 'Mochila resistente al agua con compartimento para laptop.', image: 'https://picsum.photos/id/1080/400/300' },
    { id: 9, name: 'Gorra Deportiva Casual', category: 'Accesorios', price: 35, description: 'Gorra ajustable con protección solar y diseño transpirable.', image: 'https://picsum.photos/id/103/400/300' },
    { id: 10, name: 'Botella Térmica de Acero', category: 'Accesorios', price: 45, description: 'Mantiene tus bebidas frías por 24h y calientes por 12h.', image: 'https://picsum.photos/id/431/400/300' },
    { id: 11, name: 'Botas de Senderismo Waterproof', category: 'Calzado', price: 280, description: 'Calzado resistente para montaña con tracción superior.', image: 'https://picsum.photos/id/146/400/300' },
    { id: 12, name: 'Sillón Individual Acolchado', category: 'Muebles', price: 380, description: 'Sillón de descanso tapizado en terciopelo gris.', image: 'https://picsum.photos/id/449/400/300' },
    { id: 13, name: 'Cámara Mirrorless Compacta', category: 'Electrónica', price: 899, description: 'Captura fotos profesionales y video en resolución 4K.', image: 'https://picsum.photos/id/250/400/300' },
    { id: 14, name: 'Bolso de Mano Elegante', category: 'Bolsos', price: 140, description: 'Bolso de piel sintética ideal para eventos formales.', image: 'https://picsum.photos/id/338/400/300' },
    { id: 15, name: 'Zapatos Casuales de Cuero', category: 'Calzado', price: 110, description: 'Calzado clásico de piel para uso diario u oficina.', image: 'https://picsum.photos/id/29/400/300' },
    { id: 16, name: 'Planta Decorativa Artificial', category: 'Accesorios', price: 50, description: 'Planta ornamental en maceta de cerámica blanca.', image: 'https://picsum.photos/id/106/400/300' },
    { id: 17, name: 'Control de Videojuegos Pro', category: 'Electrónica', price: 70, description: 'Mando ergonómico compatible con múltiples plataformas.', image: 'https://picsum.photos/id/96/400/300' },
    { id: 18, name: 'Mesa de Centro Minimalista', category: 'Muebles', price: 210, description: 'Mesa auxiliar redonda con estructura metálica.', image: 'https://picsum.photos/id/532/400/300' },
    { id: 19, name: 'Maleta de Viaje Rigida', category: 'Bolsos', price: 160, description: 'Maleta mediana con ruedas giratorias de 360 grados.', image: 'https://picsum.photos/id/517/400/300' },
    { id: 20, name: 'Sandalias de Verano Casuales', category: 'Calzado', price: 40, description: 'Sandalias cómodas y frescas para la temporada de playa.', image: 'https://picsum.photos/id/326/400/300' }
  ];

  filteredProducts$!: Observable<Product[]>;

  ngOnInit(): void {
    const search$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => (value ? value.trim().toLowerCase() : ''))
    );

    const category$ = this.categoryControl.valueChanges.pipe(
      startWith('All')
    );

    const price$ = this.priceControl.valueChanges.pipe(
      startWith(1000)
    );

    this.filteredProducts$ = combineLatest([search$, category$, price$]).pipe(
      map(([searchTerm, selectedCategory, maxPrice]) => {
        return this.products.filter(product => {
          const matchesName = product.name.toLowerCase().includes(searchTerm);
          // Actualizamos la validación para que coincida con los valores del select en español
          const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
          const matchesPrice = product.price <= Number(maxPrice);
          
          return matchesName && matchesCategory && matchesPrice;
        });
      })
    );
  }
}