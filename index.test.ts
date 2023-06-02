import { describe, test, expect } from '@jest/globals';

import { parse } from './index';

describe('parse', () => {
    test('parse an empty array', () => {
        expect(parse('[]')).toStrictEqual([]);
    });
    test('parse a nested array', () => {
        expect(parse('[[[]]]')).toStrictEqual([[[]]]);
    });
    test('parse an array including elements', () => {
        expect(parse('[1,2,3]')).toStrictEqual([1,2,3]);
    });
    test('parse a string', () => {
        expect(parse('\"aaa\"')).toStrictEqual("aaa");
    });
    test('parse an object', () => {
        expect(parse('{ "key": 123 }')).toStrictEqual({ key: 123 });
    });
    test('parse a nested object', () => {
        expect(parse('{ "key1": { "key2": 123 } }')).toStrictEqual({ key1: { key2: 123 } });
    });
});

