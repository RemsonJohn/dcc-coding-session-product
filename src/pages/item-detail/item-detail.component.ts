import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartItem, Item } from '../../interfaces/item.interface';
import { ItemService } from '../../services/item.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-item-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, CurrencyPipe],
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent {

    public item: WritableSignal<Item | null> = signal(null);
    public loading: WritableSignal<boolean> = signal(true);
    public notFound: WritableSignal<boolean> = signal(false);
    public addedToCart: WritableSignal<boolean> = signal(false);
    public cartCount: WritableSignal<number> = signal(1);
    public cartIconSrc: Signal<string> = computed(() => this.addedToCart() ? '../../assets/images/cart-check.svg' : '../../assets/images/cart-add.svg')


    private sub$: Subscription | null = null;
    private _itemService: ItemService = inject(ItemService);

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        const itemId: number = Number(this.route.snapshot.paramMap.get('id'));
        this.sub$ = this._itemService.getItemById(itemId).subscribe({
            next: (item: Item | undefined) => {
                this.item.set(item || null);
                this.notFound.set(!item);
                this.loading.set(false);
            },
            error: () => {
                this.notFound.set(true);
                this.loading.set(false);
            }
        });
    }

    // Function to implement add to cart
    addToCart() {
        const item: Item = this.item() as Item;
        if (!item) return;
        this._itemService.cartList.update((cart: CartItem[]) => {
            if (!cart) return [{ ...item, count: this.cartCount() }];
            const itemIndex = cart.findIndex((fItem: CartItem) => fItem.id === item?.id);
            if (itemIndex > -1) {
                const current = cart[itemIndex].count ?? 0
                cart[itemIndex] = { ...cart[itemIndex], count: (this.cartCount() + current) };
                return cart;
            } else {
                return [...cart, { ...item, count: this.cartCount() }];
            }
        });
        console.log(this._itemService.cartList())
    }

    ngOnDestroy(): void {
        this.sub$?.unsubscribe()
    }
}
