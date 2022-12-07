export function parseEnum<TEnum>(enumObj: TEnum, enumValue: keyof TEnum): TEnum[keyof TEnum] {
  return enumObj[enumValue];
}