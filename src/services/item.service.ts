import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CartItem, Item } from '../interfaces/item.interface';

@Injectable({ providedIn: 'root' })
export class ItemService {
    private readonly url = 'assets/items.json';
    public cartList: WritableSignal<CartItem[]> = signal([]);


    private _http: HttpClient = inject(HttpClient);

    // Fetch all items from the JSON file
    public getItems(): Observable<Item[]> {
        return this._http.get<Item[]>(this.url).pipe(
            map((data: Item[]) => data)
        );
    }

    // Fetch a single item by its ID
    public getItemById(id: number): Observable<Item | undefined> {
        return this.getItems().pipe(
            map((items: Item[]) => items.find(item => item.id === id))
        );
    }
}
