import { IAddress } from 'src/app/dictionaries/addresses/models/address';
import { IArea } from 'src/app/dictionaries/addresses/models/area';
import { IRack } from 'src/app/dictionaries/addresses/models/rack';
import { IShelf } from 'src/app/dictionaries/addresses/models/shelf';
import { IVerticalSection } from 'src/app/dictionaries/addresses/models/vertical-section';

export interface AddressPickerDialogData {
  Address: IAddress | undefined;
  Area?: IArea;
  Rack?: IRack;
  VerticalSection?: IVerticalSection;
  Shelf?: IShelf;
}