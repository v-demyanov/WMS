import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressesRoute } from '../addresses-routing.constants';

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

  public selectedItemId?: number;

  public addressTreeItemType = AddressTreeItemType;

  private componentSubscriptions: Subscription[] = [];

  constructor(
    private readonly addressTreeItemService: AddressTreeItemService,
    private readonly snackBar: MatSnackBar,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
  }

  public ngOnDestroy = (): void =>
    this.componentSubscriptions.forEach((subscription) => subscription.unsubscribe());

  public ngOnInit(): void {
    this.loadTree();
  }

  public hasChild = (_: number, node: IAddressTreeItem): boolean => !!node.Children && node.Children.length > 0;

  public getTreeItemIcon(treeItemType: AddressTreeItemType, treeItemId: number): string {
    switch (treeItemType) {
      case AddressTreeItemType.Area:
        return treeItemId === this.selectedItemId ? 'assets/area-white.png' : 'assets/area-black.png';
      case  AddressTreeItemType.Rack:
        return treeItemId === this.selectedItemId ? 'assets/rack-white.png' : 'assets/rack-black.png';
      case AddressTreeItemType.VerticalSection:
        return treeItemId === this.selectedItemId ? 'assets/vertical-section-white.png' : 'assets/vertical-section-black.png';
      case AddressTreeItemType.Shelf:
        return treeItemId === this.selectedItemId ? 'assets/shelf-white.png' : 'assets/shelf-black.png';
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

  public async onSelectItem(node: IAddressTreeItem): Promise<void> {
    this.selectedItemId = node.Id;

    let targetPath: string = '';
    switch (node.Type) {
      case AddressTreeItemType.Area:
        targetPath = `${AddressesRoute.Area}/${node.Id}`;
        break;
      case AddressTreeItemType.Rack:
        targetPath = `${AddressesRoute.Area}/${node.Parent?.Id}/${AddressesRoute.Rack}/${node.Id}`;
        break;
      case AddressTreeItemType.VerticalSection:
        targetPath = `${AddressesRoute.Area}/${node.Parent?.Parent?.Id}/${AddressesRoute.Rack}/${node.Parent?.Id}/${AddressesRoute.VerticalSection}/${node.Id}`;
        break;
      case AddressTreeItemType.Shelf:
        targetPath = `${AddressesRoute.Area}/${node.Parent?.Parent?.Parent?.Id}/${AddressesRoute.Rack}/${node.Parent?.Parent?.Id}/${AddressesRoute.VerticalSection}/${node.Parent?.Id}/${AddressesRoute.Shelf}/${node.Id}`;
        break;
    }

    await this.router.navigate(
      [targetPath],
      {relativeTo: this.route},
    );
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
