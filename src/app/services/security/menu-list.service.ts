import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MenuListService {

constructor() { }
items = [];

    addToCart(product) {
    this.items.push(product);
    }

    getItems() {
    return this.items;
    }

    clearCart() {
    this.items = [];
    return this.items;
    }
}
