type ObjectSchema = Record<string, any>;

type _DatabaseObjectWithoutID<SchemaWithoutID> = {
  get: (fieldName: keyof SchemaWithoutID) => SchemaWithoutID[typeof fieldName];
  listProperties: () => (keyof SchemaWithoutID)[];
};

export namespace Type {
  export type DatabaseObject<Schema extends ObjectSchema> =
    _DatabaseObjectWithoutID<Schema & { _id: string }>;

  export type UserObject = DatabaseObject<{
    email: string;
  }>;

  export type List<T> = {
    length: () => number;
    get: (start: number, length: number) => T;
  };

  export type DateRange = [Date, Date];
  export type NumericRange = [Number, Number];
  export type File = string;
}
