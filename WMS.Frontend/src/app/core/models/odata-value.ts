export interface ODataValue<TItem> {
  value: TItem[];
  '@odata.count'?: number;
}