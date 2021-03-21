import { ConverterConfig } from "../domain-model";

export class InfoHandler {
    private config: ConverterConfig;
    private message: {[errKey: string]: string};

    constructor(config: ConverterConfig = {}) {
        this.config = config || this.config;
        this.message = {};
    }
  
    public errMessage(errKey: string = "default"): string {
        return this.message[errKey] || "error";
    }
  
    error(name, msg, data) {
      const errMsg = `[${name}] ${msg}`;
      this.onError(errMsg, data);
      throw new Error(errMsg);
    }
  
    onError(errMsg, data) {
      const onError = this.config.onError;
      if (!isFunction(onError)) return;
      onError(errMsg, data);
    }
  }