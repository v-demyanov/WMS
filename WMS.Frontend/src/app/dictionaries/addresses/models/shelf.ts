import { IAddress } from './address';
import { IVerticalSection } from './vertical-section';

export interface IShelf {
  Id: number;
  VerticalSectionId: number;
  Index: number;

  VerticalSection?: IVerticalSection;
  Address?: IAddress | null;
}