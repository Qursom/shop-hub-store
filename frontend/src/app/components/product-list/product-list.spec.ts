import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Product } from '@app/models/product';
import { CartService } from '@app/services/cart';
import { ProductService } from '@app/services/product';
import { BehaviorSubject, of } from 'rxjs';
import { vi } from 'vitest';
import { ProductListComponent } from './product-list';

const makeProduct = (id: string): Product => ({
  id,
  name: `Product ${id}`,
  price: 9.99,
  description: 'desc',
  imageUrl: '',
  currency: 'USD',
  stock: 10,
  category: 'general',
});

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productsSubject: BehaviorSubject<Product[]>;
  let loadingSubject: BehaviorSubject<boolean>;
  let errorSubject: BehaviorSubject<string | null>;
  let totalSubject: BehaviorSubject<number>;
  let mockProductService: {
    products$: ReturnType<BehaviorSubject<Product[]>['asObservable']>;
    loading$: ReturnType<BehaviorSubject<boolean>['asObservable']>;
    error$: ReturnType<BehaviorSubject<string | null>['asObservable']>;
    total$: ReturnType<BehaviorSubject<number>['asObservable']>;
    getProducts: ReturnType<typeof vi.fn>;
    clearError: ReturnType<typeof vi.fn>;
  };
  let mockCartService: { addItem: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    productsSubject = new BehaviorSubject<Product[]>([]);
    loadingSubject = new BehaviorSubject<boolean>(false);
    errorSubject = new BehaviorSubject<string | null>(null);
    totalSubject = new BehaviorSubject<number>(0);

    mockProductService = {
      products$: productsSubject.asObservable(),
      loading$: loadingSubject.asObservable(),
      error$: errorSubject.asObservable(),
      total$: totalSubject.asObservable(),
      getProducts: vi.fn().mockReturnValue(of([])),
      clearError: vi.fn(),
    };

    mockCartService = { addItem: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: CartService, useValue: mockCartService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Test that the component renders product cards when products$ emits items
  it('displays product cards when products$ emits items', () => {
    // TODO: Push items into productsSubject
    // Call fixture.detectChanges()
    // Query the DOM and assert product names are visible
  });

  // TODO: Test that the loading spinner is shown when loading$ is true
  it('shows a loading indicator while products are being fetched', () => {
    // TODO: Push true into loadingSubject
    // Call fixture.detectChanges()
    // Assert a spinner or loading element is present in the DOM
  });

  // TODO: Test that the error banner appears when error$ has a message
  it('displays an error message when error$ emits', () => {
    // TODO: Push an error string into errorSubject (and false into loadingSubject)
    // Call fixture.detectChanges()
    // Assert the error message is visible in the DOM
  });

  // TODO: Test that addToCart() calls CartService.addItem with the correct arguments
  it('delegates addToCart to CartService.addItem with quantity 1', () => {
    // TODO: Call component.addToCart(makeProduct('p1'))
    // Assert mockCartService.addItem was called with the product and quantity 1
  });

  // TODO: Test that retry() resets the page and reloads products
  it('resets to page 1, clears the error, and reloads on retry()', () => {
    // TODO: Set component['currentPage'] to some page > 1
    // Call component.retry()
    // Assert mockProductService.clearError was called
    // Assert currentPage is back to 1
    // Assert getProducts was called with page 1
  });

  // TODO: Test that goToPage() navigates to a valid page
  it('navigates to a new page when goToPage() is called with a valid page number', () => {
    // TODO: Push a total > pageSize into totalSubject so multiple pages exist
    // Call component.goToPage(2)
    // Assert getProducts was called with the new page number
  });
});
