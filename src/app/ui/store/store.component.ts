import { Component, OnInit} from '@angular/core';

import { Breakpoints, BreakpointState, BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

import { Product } from '@app-data/product.model';
import { ProductRepository } from '@app-data/product.repo';
import { Cart } from '@app-data/cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})

export class StoreComponent implements OnInit {

  columns: number;
  observerSubscription: Subscription;
  showFilter: boolean = false;
  filterToggleColor: string = "primary";

  public selectedCategories: Set<string> = new Set;

  public productsPerPage = 4;
  public selectedPage = 0;

  constructor(
    private router: Router,
    private _repository: ProductRepository,
    private cart: Cart,
    breakpointObserver: BreakpointObserver) {
    this.observerSubscription = breakpointObserver.observe([Breakpoints.XSmall])
    .subscribe((result: BreakpointState) => {
      if (result.matches) {
        this.columns = 1;
      } else {
        this.columns = 4;
      }
    });
  }

  ngOnInit() {}


  get categories(): string[] {
    return this._repository.getCategories();
  }
  changeCategory(newCategory?: string) {
    if (this.selectedCategories.has(newCategory)) {
      this.selectedCategories.delete(newCategory);
    } else {
      this.selectedCategories.add(newCategory);
    }
  }
  get productsInCategory(): Product[] {
    return this._repository.getProducts(this.selectedCategories);
  }
  get productsOnPage(): Product[] {
    const pageIndex = this.selectedPage * this.productsPerPage;
    const singlePageOfProducts = this.productsInCategory.slice(pageIndex, pageIndex + this.productsPerPage);
    return singlePageOfProducts;
  }

  changePage(newPage: number) {
    this.selectedPage = newPage;
  }
  changePageSize(newPageSize: number) {
    this.productsPerPage = newPageSize;
    this.changePage(0);
  }
  get numberOfPages(): number {
    return Math.ceil
    (this.productsInCategory.length / this.productsPerPage);
  }

  paginatorEvent(event) {
    const newPageIndex = event.pageIndex;
    const newPageSize = event.pageSize;
    if (this.productsPerPage !== newPageSize) {
      this.changePageSize(newPageSize);
    }
    if (this.selectedPage !== newPageIndex) {
      this.changePage(newPageIndex);
    }
  }

  addProductToCart(product: Product) {
    this.cart.addLine(product);
  }

  toggleShowFilter() {
    this.showFilter = !this.showFilter;
    if (this.filterToggleColor === "primary") {
      this.filterToggleColor = "accent";
    } else {
      this.filterToggleColor = "primary";
    }
  }

}
