import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, mergeMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DictionariesService } from '../services/dictionaries.service';
import { DictinaryItem } from '../models/dictionary-item';

@Component({
  selector: 'app-dictionaries-page',
  templateUrl: './dictionaries-page.component.html',
  styleUrls: ['./dictionaries-page.component.scss']
})
export class DictionariesPageComponent implements OnInit, OnDestroy {

  public isLoading: boolean = true;

  public dictionaryItems: DictinaryItem[] = [];

  public displayedColumns: string[] = ['Value', 'Actions'];

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly dictionaryService: DictionariesService,
    private readonly route: ActivatedRoute,
    private readonly snackBar: MatSnackBar)
  {}

  public ngOnInit(): void {
    const subscription = this.route.params
      .pipe(mergeMap(params => {
        return this.dictionaryService.getAll(params['name']);
      }))
      .subscribe({
        next: dictionaryItems => {
          this.dictionaryItems = dictionaryItems;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при словарей', 'Закрыть', {
            duration: 3000,
          });
        },
      });

    this.componentSubscriptions.push(subscription);
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) =>
      subscription.unsubscribe()
    );
}
