import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AppService } from '../../../../../core/services/app';
import { UserServices } from '../../../../../core/services/user-services';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../../../../core/services/settings/toast-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-list-users',
  imports: [TranslatePipe],
  templateUrl: './list-users.html',
  styleUrl: './list-users.css',
})
export class ListUsers implements OnInit {
  public appService = inject(AppService);
  public userServices = inject(UserServices);
  readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);
  readonly toastService = inject(ToastService);
  readonly usersList = signal<any[]>([]);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.loading.set(true);
    this.userServices
      .get()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res: any) => {
          this.usersList.set(res.data.users)
          console.log(res.data.users);

          this.loading.set(false);
        },
        error: (err) => {
          console.log(err);
          this.loading.set(false);
        },
      });
  }
}
