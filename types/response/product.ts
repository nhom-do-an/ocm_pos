import { CollectionRule } from './../../../ocm_fe/types/response/collection';
import { ECollectionType } from "../enums/enum";
import { CreateInventoryQuantity } from "../request/product";
import { Attachment } from '@/services/variant';
export interface Collection {
    id?: number;
    store_id?: number;
    name: string;
    alias?: string;
    description: string;
    type: ECollectionType;
    disjunctive?: boolean;
    rules: CollectionRule[];
    meta_title: string;
    meta_description: string;
    image?: Attachment;
    created_at?: string;
    updated_at?: string;
    products_count?: number;
}

export interface ProductAttribute {
    id?: number;
    name: string;
    position: number;
    values: string[];
}

export interface ProductVariant {
    id?: number;
    product_id?: number;
    product_name?: string;
    title: string;
    sku: string;
    barcode?: string;
    price: number;
    compare_at_price: number;
    cost_price: number;
    inventory_quantity?: number;
    sold?: number;
    option1?: string;
    option2?: string;
    option3?: string;
    unit?: string;
    weight?: number;
    weight_unit?: string;
    type?: string;
    position: number;
    lot_management: boolean;
    tracked: boolean;
    requires_shipping?: boolean;
    image_id?: number;
    image?: Attachment;
    created_at?: string;
    updated_at?: string;
    inventory_quantities?: CreateInventoryQuantity[];
}

export interface Product {
    id?: number;
    alias?: string;
    name: string;
    summary: string;
    content: string;
    product_type: string;
    type: string;
    vendor: string;
    status: "active" | "inactive";
    meta_title: string;
    meta_description: string;
    published_on?: string;
    created_at?: string;
    updated_at?: string;
    tags: string[];
    attributes: ProductAttribute[];
    images: Attachment[];
    variants: ProductVariant[];
    collections: Collection[]
}

export interface GetListProductsResponse {
    products: Product[];
    count: number;
}