import { WareAdvancedFilterDescriptor } from './ware-advanced-filter-descriptor';

export interface WareFilterDescriptor {
  AdvancedFilterDescriptor?: WareAdvancedFilterDescriptor;
  SearchValue?: string;
}