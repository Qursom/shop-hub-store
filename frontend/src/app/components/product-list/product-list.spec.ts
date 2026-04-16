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

  it('displays product cards when products$ emits items', () => {
    productsSubject.next([makeProduct('p1'), makeProduct('p2')]);
    fixture.detectChanges();

    const html = fixture.nativeElement.textContent;
    expect(html).toContain('Product p1');
    expect(html).toContain('Product p2');
  });

  it('shows a loading indicator while products are being fetched', () => {
    loadingSubject.next(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading products...');
  });

  it('displays an error message when error$ emits', () => {
    loadingSubject.next(false);
    errorSubject.next('Failed to load products');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Failed to load products');
  });

  it('delegates addToCart to CartService.addItem with quantity 1', () => {
    const product = makeProduct('p1');
    component.addToCart(product);

    expect(mockCartService.addItem).toHaveBeenCalledWith(product, 1);
  });

  it('resets to page 1, clears the error, and reloads on retry()', () => {
    component.currentPage = 3;
    mockProductService.getProducts.mockClear();

    component.retry();

    expect(mockProductService.clearError).toHaveBeenCalled();
    expect(component.currentPage).toBe(1);
    expect(mockProductService.getProducts).toHaveBeenCalledWith(1, 10);
  });

  it('navigates to a new page when goToPage() is called with a valid page number', () => {
    totalSubject.next(20);
    mockProductService.getProducts.mockClear();

    component.goToPage(2);

    expect(mockProductService.getProducts).toHaveBeenCalledWith(2, 10);
  });
});
