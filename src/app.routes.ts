import { Routes } from '@angular/router';
import { ItemsComponent } from './pages/items/items.component';
import { ItemDetailComponent } from './pages/item-detail/item-detail.component';
import {HomeComponent} from "./pages/home/home.component";

export const routes: Routes = [
    { path: 'home', component: HomeComponent, title: 'Home' },
    { path: '', component: ItemsComponent, title: 'Products' },
    { path: 'items/:id', component: ItemDetailComponent, title: 'Item Detail' },
    { path: '**', redirectTo: 'items' }
];
