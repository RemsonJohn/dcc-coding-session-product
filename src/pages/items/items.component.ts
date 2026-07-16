import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { Item } from '../../interfaces/item.interface';
import { FilterListComponent } from "../../lib/filter-list/filter-list.component";
import { ItemService } from '../../services/item.service';

@Component({
    selector: 'app-item-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe, FilterListComponent],
    templateUrl: './items.component.html',
    styleUrls: ['./items.component.scss']
})
export class ItemsComponent {
    private items: WritableSignal<Item[]> = signal([]);
    public filter: WritableSignal<string> = signal('');

    public inStockOnly: WritableSignal<boolean> = signal(false);
    public loading: WritableSignal<boolean> = signal(true);
    public error: WritableSignal<boolean> = signal(false);
    public showFilterRow: WritableSignal<boolean> = signal(false);

    public filterCategory: WritableSignal<string> = signal('All');
    public filterPriceRange: WritableSignal<string> = signal('All');


    // finding Unique categories
    public categories: Signal<string[]> = computed(() => {
        const uniqueCategories = new Set(this.items().map((item: Item) => item.category));
        return ['All', ...Array.from(uniqueCategories)];
    });

    // setting unique filters
    public filterCount: Signal<number> = computed(() => {
        const categoryFilterApplied = this.filterCategory() !== 'All' ? 1 : 0
        const priceFilterApplied = this.filterPriceRange() !== 'All' ? 1 : 0
        const stockFilterApplied = this.inStockOnly() ? 1 : 0
        return categoryFilterApplied + priceFilterApplied + stockFilterApplied;
    });


    public priceRanges: Signal<string[]> = computed(() => {
        return ['All', '$0 - $50', '$51 - $100', '$101 - $200', '$201+'];
    });

    // Filter login using computed signals
    public filteredItems: Signal<Item[]> = computed(() => {
        let filteredItems: Item[] = this.items();
        if (this.filter()) {
            filteredItems = filteredItems.filter((item: Item) =>
                item.name.toLowerCase().includes(this.filter().toLowerCase())
            );
        }
        if (this.inStockOnly()) {
            filteredItems = filteredItems.filter((item: Item) => item.inStock);
        }

        if (this.filterCategory() !== 'All') {
            filteredItems = filteredItems.filter((item: Item) => item.category === this.filterCategory());
        }

        if (this.filterPriceRange() !== 'All') {
            filteredItems = filteredItems.filter((item: Item) => {
                const price = item.price;
                switch (this.filterPriceRange()) {
                    case '$0 - $50':
                        return price >= 0 && price <= 50;
                    case '$51 - $100':
                        return price >= 51 && price <= 100;
                    case '$101 - $200':
                        return price >= 101 && price <= 200;
                    case '$201+':
                        return price >= 201;
                    default:
                        return true;
                }
            });
        }

        return filteredItems;
    });

    private sub$: Subscription | null = null;
    private _itemService: ItemService = inject(ItemService);

    ngOnInit(): void {
        this.sub$ = this._itemService.getItems().pipe(
            map((items: Item[]) => {
                this.loading.set(false);
                return items;
            })
        ).subscribe((items: Item[]) => {
            this.items.set(items);
        });
    }

    ngOnDestroy(): void {
        this.sub$?.unsubscribe();

    }
}
