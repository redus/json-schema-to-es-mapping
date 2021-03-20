const { createMappingItemFactory } = require("./item");

const createFactory = createMappingItemFactory;

describe("MappingItem", () => {
  const strItem = {
    type: "string"
  };
  const intItem = {
    type: "integer"
  };

  describe("resolver", () => {
    describe("no resolver in config", () => {
      const config = {};
      const createMapper = createFactory(config);
      const mapper = createMapper({ item: strItem });

      test("uses default resolver", () => {
        expect(mapper.resolver).toBeDefined();
      });
    });

    describe("resolver in config", () => {
      const config = {
        itemResolver: () => 42
      };
      const createMapper = createFactory(config);
      const mapper = createMapper({ item: strItem });

      test("uses config itemResolver", () => {
        expect(mapper.resolver).toBeDefined();
      });

      describe("validatedResolver", () => {
        describe("is a function", () => {
          test("is valid", () => {
            expect(mapper.validatedResolver).toBeTruthy();
          });
        });
        describe("is not a function", () => {
          const config = {
            itemResolver: 12
          };
          const createMapper = createFactory(config);
          const mapper = createMapper({ item: strItem });

          test("is invalid", () => {
            expect(() => mapper.validatedResolver).toThrow();
          });
        });
      });
    });
  });

  describe("itemEntryPayload", () => {
    const config = {};
    const createMapper = createFactory(config);
    const mapper = createMapper({ item: strItem });

    const payload = mapper.itemEntryPayload;
    test("has parentName", () => {
      expect(payload.parentName).toBe(mapper.key);
    });

    test("has item value", () => {
      expect(payload.value).toBe(mapper.item);
    });
  });

  describe("resolve", () => {
    const config = {};

    const createMapper = createFactory(config);
    const mapper = createMapper({ item: intItem });

    describe("primitive type", () => {
      test("resolves string", () => {
        const resolved = mapper.resolve(strItem);
        expect(resolved).toEqual({ type: "keyword" });
      });

      test("resolves integer", () => {
        const resolved = mapper.resolve(intItem);
        expect(resolved).toEqual({ type: "integer" });
      });
    });

    describe("named object type", () => {
      const resolved = mapper.resolve({
        name: "account",
        typeName: "MyAccount",
        type: "object",
        properties: {
          level: {
            type: "integer"
          }
        }
      });

      test("resolves to name", () => {
        expect(resolved).toEqual({
          properties: { level: { type: "integer" } },
          type: "object"
        });
      });
    });
  });
});
