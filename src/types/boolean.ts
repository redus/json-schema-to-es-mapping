import { MappingBaseType } from ".";

function toBoolean(obj) {
    return isBoolean(obj.type) && MappingBoolean.create(obj).convert();
  }
  
class MappingBoolean extends MappingBaseType {
    get baseType(): string {
      return "boolean";
    }
  
    static create(obj) {
      return new MappingBoolean(obj);
    }
}
  
  module.exports = {
    toBoolean,
    MappingBoolean
  };