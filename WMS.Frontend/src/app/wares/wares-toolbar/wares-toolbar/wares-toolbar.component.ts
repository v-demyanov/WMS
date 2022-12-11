import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, UrlSegment } from '@angular/router';
import { Subscription, take } from 'rxjs';

import { NavigationUrls } from 'src/app/core/constants/navigation-urls.constants';
import { WaresRoute } from '../../wares-routing.constants';

@Component({
  selector: 'app-wares-toolbar',
  templateUrl: './wares-toolbar.component.html',
  styleUrls: ['./wares-toolbar.component.scss']
})
export class WaresToolbarComponent implements OnInit, OnDestroy {

  @Input()
  public wareCount: number = 0;

  public selectedWareId?: number;

  public isCreating: boolean = false;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    this.componentSubscriptions = [
      this.route.url
        .pipe(take(1))
        .subscribe((routes: UrlSegment[]) => {
          this.isCreating = routes[0]?.path === WaresRoute.Create;
        }),
      this.route.params.subscribe((params: Params) => {
        this.selectedWareId = params['id'];
      }),
    ];
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );

  public async onAddBtnClick(): Promise<void> {
    await this.router.navigate(
      [`${NavigationUrls.Wares}/${WaresRoute.Create}`],
      {relativeTo: this.route},
    );
  }
}
