import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AreasService } from './areas.service';
import { IAddressTreeItem } from '../models/address-tree-item';
import { IArea } from '../models/area';
import { IRack } from '../models/rack';
import { IVerticalSection } from '../models/vertical-section';
import { IShelf } from '../models/shelf';
import { AddressTreeItemType } from '../enums/address-tree-item-type';

@Injectable({
  providedIn: 'root'
})
export class AddressTreeItemService {

  constructor(private readonly areaService: AreasService) { }

  public getAll(): Observable<IAddressTreeItem[]> {
    return this.areaService
      .getAllForTree()
      .pipe(map((areas: IArea[]) => areas.map(x => this.parseAreaToTreeItem(x))));
  }

  private parseAreaToTreeItem(area: IArea): IAddressTreeItem {
    const children = area.Racks?.map(x => this.parseRackToTreeItem(x));
    const treeItem = <IAddressTreeItem>{
      Id: area.Id,
      Type: AddressTreeItemType.Area,
      Name: area.Name,
      Children: children,
    };

    treeItem.Children = treeItem.Children?.map(x => {
      x.Parent = treeItem;
      return x;
    });

    return treeItem;
  }

  private parseRackToTreeItem(rack: IRack): IAddressTreeItem {
    const children = rack.VerticalSections?.map(x => this.parseVerticalSectionToTreeItem(x));
    const treeItem = <IAddressTreeItem>{
      Id: rack.Id,
      Type: AddressTreeItemType.Rack,
      Name: String(rack.Index),
      Children: children,
    };

    treeItem.Children = treeItem.Children?.map(x => {
      x.Parent = treeItem;
      return x;
    });

    return treeItem;
  }

  private parseVerticalSectionToTreeItem(verticalSection: IVerticalSection): IAddressTreeItem {
    const children = verticalSection.Shelfs?.map(x => this.parseShelfToTreeItem(x)); 
    const treeItem = <IAddressTreeItem>{
      Id: verticalSection.Id,
      Type: AddressTreeItemType.VerticalSection,
      Name: String(verticalSection.Index),
      Children: children,
    };

    treeItem.Children = treeItem.Children?.map(x => {
      x.Parent = treeItem;
      return x;
    });

    return treeItem;
  }

  private parseShelfToTreeItem(shelf: IShelf): IAddressTreeItem {
    return <IAddressTreeItem>{
      Id: shelf.Id,
      Type: AddressTreeItemType.Shelf,
      Name: String(shelf.Index),
      InUse: !!shelf.Problem || !!shelf.Ware,
    };
  }
}
