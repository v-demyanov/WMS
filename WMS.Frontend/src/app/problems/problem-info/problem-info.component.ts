import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-problem-info',
  templateUrl: './problem-info.component.html',
  styleUrls: ['./problem-info.component.scss']
})
export class ProblemInfoComponent implements OnInit, OnDestroy {

  private componentSubscriptions: Subscription[] = [];

  constructor(private readonly route: ActivatedRoute) {}

  public ngOnInit(): void {
    this.componentSubscriptions = [
      this.subscribeOnRouteParamsChanges(),
    ];
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );

  private subscribeOnRouteParamsChanges(): Subscription {
    return this.route.params.subscribe((params: Params) => {
      const problemId: number | undefined = params['id'];
      if (problemId) {
        console.log(problemId);
      }
    });
  }

  private loadProblem(): void {
    
  }
}
