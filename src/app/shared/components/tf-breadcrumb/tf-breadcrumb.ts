import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AppService } from '../../../core/services/app';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-tf-breadcrumb',
  imports: [TranslatePipe, RouterLink],
  templateUrl: './tf-breadcrumb.html',
  styleUrl: './tf-breadcrumb.css',
})
export class TfBreadcrumb {
  // =========================
  // Inject
  // =========================
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  readonly appService = inject(AppService);
  public translate = inject(TranslateService)

  // =========================
  // State
  // =========================

  breadcrumbs = signal<any[]>([]);

  currentPageTitle = computed(() => {
  const crumbs = this.breadcrumbs();

  return crumbs.at(-1)?.label || '';
});

  // =========================
  // Constructor
  // =========================

  constructor() {
    this.updateBreadcrumbs();

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd =>
            event instanceof NavigationEnd
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.updateBreadcrumbs();
      });
  }

  // =========================
  // Methods
  // =========================

  private updateBreadcrumbs(): void {
    this.breadcrumbs.set(
      this.buildBreadcrumb(this.route.root)
    );
  }

private buildBreadcrumb(
  route: ActivatedRoute,
  url: string = '',
  breadcrumbs: any[] = []
): any[] {

  let currentRoute = route;

  while (currentRoute.firstChild) {

    currentRoute = currentRoute.firstChild;

    const routeUrl =
      currentRoute.snapshot?.url
        ?.map(segment => segment.path)
        ?.join('/') || '';

    if (routeUrl) {
      url += `/${routeUrl}`;
    }

    const breadcrumb =
      currentRoute.snapshot?.data?.['breadcrumb'];

    if (breadcrumb) {

      breadcrumbs.push({
        label: breadcrumb.label,
        url: breadcrumb.url || url,
      });

    }
  }

  return breadcrumbs;
}
}
