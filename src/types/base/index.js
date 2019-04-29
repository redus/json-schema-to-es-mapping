const merge = require("merge");
const { InfoHandler } = require("../info");
const { $default } = require("../default");
const { createKeyMaker, createResultHandler } = require("./result");
const { createDispatcher } = require("./dispatcher");
const { createReferenceResolver } = require("./reference");
const { createTypeHandler } = require("./type-handler");
const { createEntryObj } = require("./entry");

class MappingBaseType extends InfoHandler {
  constructor(opts = {}, config) {
    super(config || opts.config);
    const { parentName, schema, key, value = {} } = opts;
    config = config || opts.config;
    this.opts = opts;
    this.parentName = parentName;
    this.schema = schema || config.schema;
    this.key = key;
    this.format = value.format;
    this.result = config.resultObj || {};
    this.visitedPaths = config.visitedPaths || {};
    this.config = merge.recursive($default.config, config);
    config = this.config;
    this.value = value;
    // TODO: make configurable by passing via config
    this.nested = config.nested;
    this.nestingLv = config.nestingLv;
  }

  init() {
    this.initKeyMaker();
    this.initEntryObj();
    this.initDispatcher();
    this.initTypeHandler();
    this.initResultHandler();
    this.initReferenceResolver();
    this.resolveValue();
    return this;
  }

  initKeyMaker() {
    const { key, parentName, config } = this;
    this.keyMaker = createKeyMaker({ key, parentName }, config);
    this.nestedKey = this.keyMaker.nestedKey;
    return this;
  }

  initEntryObj() {
    const { key, nestedKey } = this;
    this.entryObj = createEntryObj({ key, nestedKey }, config);
    this.entry = this.entryObj.entry;
    return this;
  }

  initDispatcher() {
    this.dispatcher = createDispatcher(this.config);
  }

  initTypeHandler() {
    const { type, typeName } = this;
    const calcType = () => type;
    this.typeHandler = createTypeHandler({ typeName, calcType }, config);
  }

  initResultHandler() {
    const { entry, keyMaker, typeHandler, config } = this;
    this.resultHandler = createResultHandler(
      { entry, keyMaker, typeHandler },
      config
    );
  }

  initReferenceResolver() {
    const { opts, config } = this;
    this.referenceResolver = createReferenceResolver(opts, config);
  }

  resolveValue() {
    this.value = this.resolve(value);
  }

  get type() {
    const calculatedType = this.typeHandler.type;
    console.log({ calculatedType });
    return calculatedType || this.baseType;
  }

  get typeMap() {
    return this.typeHandler.typeMap || {};
  }

  get typeName() {
    this.error("typeName must be specified by subclass");
  }

  dispatch() {
    this.dispatcher.dispatch(this.dispatchObj);
  }

  convert() {
    this.createAndStoreResult();
    return this.createMappingResult();
  }

  createMappingResult() {
    return this.resultHandler.createMappingResult();
  }

  createAndStoreResult() {
    this.resultHandler.createAndStoreResult();
  }

  resolve(obj) {
    const resolved = this.referenceResolver.resolve(obj);
    this.wasCacheHit = this.referenceResolver.wasCacheHit;
    return resolved;
  }

  message() {
    return config.messages[this.key] || config.messages[this.type] || {};
  }
}

module.exports = {
  MappingBaseType
};
