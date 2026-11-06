import { Component } from '@angular/core';
import { ProductSearchComponent } from './components/product-search/product-search';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductSearchComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'buscador-de-productos';
}