import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Item } from '../../interfaces/item.interface';
import { ItemService } from '../../services/item.service';

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

    constructor(private route: ActivatedRoute, private itemService: ItemService) {
    }

    ngOnInit(): void {
        const itemId = Number(this.route.snapshot.paramMap.get('id'));
        this.itemService.getItemById(itemId).subscribe({
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
        const item = this.item();
        if (!item) return;
        this.itemService.cartList.update(cart => {
            if (!cart) return [{ ...item, count: this.cartCount() }];
            const itemIndex = cart.findIndex((fItem) => fItem.id === item?.id);
            if (itemIndex > -1) {
                const current = cart[itemIndex].count ?? 0
                cart[itemIndex] = { ...cart[itemIndex], count: (this.cartCount() + current) };
                return cart;
            } else {
                return [...cart, { ...item, count: this.cartCount() }];
            }
        });
        console.log(this.itemService.cartList())
    }
}
