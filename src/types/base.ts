import { FieldMapping, FieldType } from "elastic-ts";
import { isFunction } from "./util";
import { InfoHandler } from "./info";
import { $default } from "./default";
import { createDefinitionRefResolver } from "./definition";
import { FieldMappings, LookupObject, MetaType, TypeMap } from "../domain-model";

export class MappingBaseType extends InfoHandler {
    private parentName: string;
    private key: string;
    private definitionResolver: any;
    private nested: boolean;
    private value: object;
    private _result: FieldMappings;
    private _meta: MetaType;
    private _baseType: FieldType;
    private _types: TypeMap;
    private resolvedTypeName: string;

    private nestedKey(): string {
        return [this.parentName, this.key].join("_");
    }

    public resultKey(): string {
        return this.nested ? this.nestedKey() : this.key;
    }

    private get lookupObject(): LookupObject {
        return {
            key: this.key,
            resultKey: this.resultKey(),
            parentName: this.parentName,
            schemaValue: this.value,
            typeName: this.resolvedTypeName ? this.resolvedTypeName : undefined
        };
    }

    public get lookedUpEntry(): FieldMapping {
        const { entryFor } = this.config
        return entryFor && entryFor(this.lookupObject);
    }

    public get configFieldEntry(): FieldMapping {
        return this.fields[this.key] || this.fields[this.nestedKey()];
    }

    public get entry(): FieldMapping {
        return this.lookedUpEntry || this.configFieldEntry || {
            type: this.type,
        };
    }

    public get type(): FieldType {
        return this.configType || this._baseType;
    }

    private onResult(): void {
        const maybeOnResult = this.config.onResult;
        if (!isFunction(maybeOnResult)) {
            return;
        };
        maybeOnResult({
          ...this.lookupObject,
          ...this.result
        });
    }

    public set result(_result: FieldMappings) {
        this._result = this._result;
        this.onResult();
    }

    public get result() {
        return this._result;
    }

    public get resultObj(): FieldMapping {
        return this._result[this.resultKey()];
    }

    public set resultObj(mapping: FieldMapping) {
        this._result[this.resultKey()] = mapping;
    }

    public get fields(): FieldMappings {
        return this.config.fields || {};
    }

    public get configType(): FieldType {
        return (this.entry || {}).type || this.metaType();
    }

    private metaType(type: FieldType = this._baseType): FieldType {
        return this._types[type];
    }

    get baseType(): string {
        this.error("default mapping type must be specified by subclass");
        return this._baseType;
    }
    
    constructor(opts: any = {}) {
        super(opts.config);
        const { parentName, key, value = {}, result, config = {} } = opts;
        this.parentName = parentName;
        this.key = key;
        this._baseType = "text";

        const defResolverInst = createDefinitionRefResolver(opts);
        this.definitionResolver =
            config.definitionResolver ||
            defResolverInst.resolveRefObject.bind(defResolverInst);
        this.value = this.resolveValueObject(value);

        this.config = {
            ...$default.config,
            ...config
        };

        this.nestedKey = config.nestedKey || this.nestedKey;
        this.resultKey = config.resultKey || this.resultKey;
        this.nested = config.nested;
        this._meta = this.config._meta_ || {};
        this._types = this._meta.types || {};
        this._result = result || config.resultObj || {
            [this.resultKey()]: this.entry
        };
        this.resolvedTypeName = "";
    }

    

    // resolve using defintion ref
    resolveValueObject(obj: any): any {
        if (!obj.$ref) {
            return obj;
        }
        if (!isFunction(this.definitionResolver)) {
            this.error(
                `Invalid definitionResolver, must be a function, was ${typeof this.definitionResolver}`,
                    this.definitionResolver
            );
        }
        return this.definitionResolver(obj);
    }

    public convert() {
        return this.result;
    }

}
