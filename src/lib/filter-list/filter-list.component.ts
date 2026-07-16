import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-filter-list',
  standalone: true,
  templateUrl: './filter-list.component.html',
  styleUrl: './filter-list.component.scss'
})
export class FilterListComponent {

  categories = input.required<string[]>();
  priceRanges = input.required<string[]>();

  // used to directly change 
  filterCategory = model.required<string>();
  filterPriceRange = model.required<string>();
  inStockOnly = model.required<boolean>();
}