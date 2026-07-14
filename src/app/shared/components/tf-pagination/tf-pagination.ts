import { Component, computed, inject, input, output } from '@angular/core';
import { AppService } from '../../../core/services/app';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tf-pagination',
  imports: [TranslatePipe],
  templateUrl: './tf-pagination.html',
  styleUrl: './tf-pagination.css',
})
export class TfPagination {
  public appService = inject(AppService)
  public transalate = inject(TranslateService)
  readonly currentPage = input(1);
  readonly totalItemsCount = input(0);
  readonly perPage = input(10);

  readonly pageChange = output<number>();
  readonly perPageChange = output<number>();

  readonly perPageOptions = [10, 20, 50, 100];

  readonly totalPages = computed(() =>
    this.perPage() > 0
      ? Math.ceil(this.totalItemsCount() / this.perPage())
      : 0
  );

  readonly pages = computed<(number | string)[]>(() => {
    const pages: (number | string)[] = [];

    const total = this.totalPages();
    const current = this.currentPage();

    if (total <= 7) {
      return Array.from(
        { length: total },
        (_, index) => index + 1
      );
    }

    pages.push(1);

    if (current > 4) {
      pages.push('...');
    }

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 3) {
      pages.push('...');
    }

    pages.push(total);

    return pages;
  });

  navigateTo(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages() ||
      page === this.currentPage()
    ) {
      return;
    }

    this.pageChange.emit(page);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  changePerPage(value: string | number): void {
    const perPage = Number(value);

    this.perPageChange.emit(perPage);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
