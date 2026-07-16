export interface Item {
    id: number,
    name: string,
    category: string,
    price: number,
    description: string,
    inStock: boolean,
    stockCount: number,
    image: string
}

export interface CartItem extends Item {
    count?: number;
}