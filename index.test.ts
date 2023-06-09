import { describe, test, expect } from "@jest/globals";

import { parse } from "./index";

describe("parse", () => {
  test.each<{ text: string; expected: any }>`
    text                             | expected
    ${`[]`}                          | ${[]}
    ${`[[[]]]`}                      | ${[[[]]]}
    ${`[1,2,3]`}                     | ${[1, 2, 3]}
    ${`\"aaa\"`}                     | ${"aaa"}
    ${`{ "key": 123 }`}              | ${{ key: 123 }}
    ${`{ "key1": { "key2": 123 } }`} | ${{ key1: { key2: 123 } }}
    ${`123`}                         | ${123}
    ${`-123`}                        | ${-123}
    ${`123.01`}                      | ${123.01}
    ${`123e1`}                       | ${1230}
    ${`123E-1`}                      | ${12.3}
    ${`true`}                        | ${true}
    ${`false`}                       | ${false}
    ${`null`}                        | ${null}
  `("expected $expected when $text is passed", ({ text, expected }) => {
    expect(parse(text)).toStrictEqual(expected);
  });

  test.each<{ text: string }>`
    text
    ${`[`}
    ${`[[]`}
    ${`[]]`}
    ${`{`}
    ${`{{}`}
    ${`{}}`}
    ${`01`}
  `("thrown an exception when $text is passed", ({ text }) => {
    expect(() => parse(text)).toThrowError();
  });
});
