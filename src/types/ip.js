const { MappingBase } = require("./base");

const isIpKey = name => ["url", "uri"].includes(name);

const isIp = (obj, key) => {
  return isString(obj.type) && isIpKey(key);
};

function toIp(obj) {
  return isIp(obj) && MappingIp.create(obj).convert();
}

class MappingIp extends MappingBase {
  get baseType() {
    return "ip";
  }

  get typeName() {
    return "ip";
  }

  static create(obj) {
    return new MappingIp(obj);
  }
}

module.exports = {
  isIp,
  toIp,
  MappingIp
};
