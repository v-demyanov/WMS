import { IArea } from 'src/app/addresses/models/area';
import { IRack } from 'src/app/addresses/models/rack';
import { IShelf } from 'src/app/addresses/models/shelf';
import { IVerticalSection } from 'src/app/addresses/models/vertical-section';

export interface AddressPickerDialogData {
  Area?: IArea;
  Rack?: IRack;
  VerticalSection?: IVerticalSection;
  Shelf?: IShelf;
}