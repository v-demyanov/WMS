import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

import { IAddressTreeItem } from '../models/address-tree-item';
import { AddressTreeItemType } from '../enums/address-tree-item-type';
import { AddressTreeItemService } from '../services/address-tree-item.service';

@Component({
  selector: 'app-addresses-tree',
  templateUrl: './addresses-tree.component.html',
  styleUrls: ['./addresses-tree.component.scss']
})
export class AddressesTreeComponent {

  public treeControl = new NestedTreeControl<IAddressTreeItem>(node => node.Children);

  public dataSource = new MatTreeNestedDataSource<IAddressTreeItem>();

  public isLoading: boolean = false;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly addressTreeItemService: AddressTreeItemService,
    private readonly snackBar: MatSnackBar,
  ) {
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) => subscription.unsubscribe());

  public ngOnInit(): void {
    this.loadTree();
  }

  public hasChild = (_: number, node: IAddressTreeItem): boolean => !!node.Children && node.Children.length > 0;

  public getTreeItemIcon(treeItemType: AddressTreeItemType): string {
    switch (treeItemType) {
      case AddressTreeItemType.Area:
        return 'assets/area.jpg';
      case AddressTreeItemType.Rack:
        return 'assets/rack.jpg';
      case AddressTreeItemType.VerticalSection:
        return 'assets/vertical-section.png';
      case AddressTreeItemType.Shelf:
        return 'assets/shelf.jpg';
    }
  }

  public getTreeItemDisplayName(treeItemName: string, treeItemType: AddressTreeItemType): string {
    switch (treeItemType) {
      case AddressTreeItemType.Area:
        return `Зона - ${treeItemName}`;
      case AddressTreeItemType.Rack:
        return `Стелаж - ${treeItemName}`;
      case AddressTreeItemType.VerticalSection:
        return `Секция - ${treeItemName}`;
      case AddressTreeItemType.Shelf:
        return `Полка - ${treeItemName}`;
    }
  }

  private loadTree(): void {
    this.isLoading = true;
    const subscription = this.addressTreeItemService
      .getAll()
      .subscribe({
        next: (treeItems: IAddressTreeItem[]) => {
          this.dataSource.data = treeItems;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.snackBar.open('Ошибка при загрузке адресов', 'Закрыть', {
            duration: 3000,
          });
        },
      });
    this.componentSubscriptions.push(subscription);
  }
}
