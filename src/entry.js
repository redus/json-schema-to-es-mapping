const {
  toString,
  toNumber,
  toBoolean,
  toArray,
  toObject,
  toDate,
  toNumericRange,
  toDateRange
} = require("./types");

class SchemaEntryError extends Error {}

class SchemaEntry {
  constructor(obj, config = {}) {
    const { parentName, key, value } = obj;
    this.parentName = parentName;
    this.key = key;
    this.value = value;
    this.config = config;
    this.type = value.type;

    this.defaults = {
      types: {
        string: toString,
        number: toNumber,
        boolean: toBoolean,
        array: toArray,
        object: toObject,
        date: toDate,
        dateRange: toDateRange,
        numericRange: toNumericRange
      },
      typeOrder: [
        "string",
        "dateRange",
        "numericRange",
        "number",
        "boolean",
        "array",
        "object",
        "date"
      ]
    };

    this.types = {
      ...this.defaults.types,
      ...(config.types || {})
    };
    this.typeOrder = config.typeOrder || this.defaults.typeOrder;
  }

  isValidSchema() {
    return typeof this.type === "string";
  }

  error(msg) {
    throw new SchemaEntryError(msg);
  }

  toEntry() {
    if (!this.isValidSchema()) {
      this.error(`Not a valid schema: type ${this.type}`, this.value);
    }
    let foundValue;
    this.typeOrder.find(type => {
      foundValue = this.types[type](this.obj);
      return foundValue;
    });
    return foundValue || this.defaultTypeHandler(this.config);
  }

  get obj() {
    return {
      parentName: this.parentName,
      key: this.key,
      value: this.value,
      type: this.type,
      config: this.config
    };
  }

  defaultTypeHandler(config) {
    this.error(`No type matched for type: ${this.type}`, {
      obj: this.obj,
      config
    });
  }
}

module.exports = {
  SchemaEntryError,
  SchemaEntry
};
