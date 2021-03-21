import { FieldMapping, FieldType } from "elastic-ts";

export type ConverterConfig = any;
export class ConvertMappingSchemaError extends Error {};
export interface ESFieldConfig {
    readonly type: string;
    readonly format?: string;
    readonly fields?: any;
};
export interface FieldMappings {
    [fieldName: string]: FieldMapping
};
export interface LookupObject {
    readonly key: string;
    readonly resultKey: string;
    readonly parentName: string;
    readonly schemaValue: object;
    readonly typeName?: string;
};
export interface MetaType {
    types: TypeMap
};
export type TypeMap = {
    [schemaType: string]: FieldType
};

