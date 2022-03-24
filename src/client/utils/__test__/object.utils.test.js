import { isObject, isObjectEmpty, deepSpread } from '../object.utils';

describe('Test file object.utils functions', () => {
  describe('isObject function', () => {
    test('is an object passed', () => {
      const data = { hello: 'world' };
      expect(isObject(data)).toBeTruthy();
    });
    test('when a non object is passed', () => {
      expect(isObject('hello')).toBeFalsy();
    });
  });

  describe('isObjectEmpty function', () => {
    test('pass an empty object', () => {
      expect(isObjectEmpty({})).toBeTruthy();
    });
    test('pass a non empty object', () => {
      const data = { hello: 'world' };
      expect(isObjectEmpty(data)).toBeFalsy();
    });
    test('pass nothing', () => {
      expect(isObjectEmpty()).toBeNull();
    });
  });

  describe('deepSpread function', () => {
    test('spread two basic objects', () => {
      const obj1 = { firstName: 'Carl' };
      const obj2 = { lastName: 'Wethers' };

      expect(deepSpread(obj1, obj2)).toMatchObject({
        firstName: 'Carl',
        lastName: 'Wethers',
      });
    });
    test('spread a boolean', () => {
      const obj1 = { firstName: 'Carl', lovesPizza: true, likesGarlic: true };
      const obj2 = { lastName: 'Wethers', hatesShrimp: false, likesGarlic: false };

      expect(deepSpread(obj1, obj2)).toMatchObject({
        firstName: 'Carl',
        lastName: 'Wethers',
        lovesPizza: true,
        hatesShrimp: false,
        likesGarlic: false,
      });
    });
    test('spread an array', () => {
      const obj1 = { numbers: ['one', 'two'] };
      const obj2 = { numbers: ['three'] };
      expect(deepSpread(obj1, obj2)).toMatchObject({ numbers: ['one', 'two', 'three'] });
    });
    test('spread deep nested objects', () => {
      const obj1 = {
        firstName: 'Carl',
        attributes: {
          hands: 'one',
          lovesPizza: false,
          hatesShrimp: true,
          toes: ['one', 'two'],
          legs: ['left', 'right'],
          eyes: {
            left: 'blue',
          },
        },
      };
      const obj2 = {
        lastName: 'Wethers',
        attributes: {
          hands: 'two',
          lovesPizza: true,
          hatesShrimp: false,
          toes: ['three'],
          eyes: {
            right: 'missing',
          },
        },
      };
      expect(deepSpread(obj1, obj2)).toMatchObject({
        firstName: 'Carl',
        lastName: 'Wethers',
        attributes: {
          hands: 'two',
          lovesPizza: true,
          hatesShrimp: false,
          toes: ['one', 'two', 'three'],
          legs: ['left', 'right'],
          eyes: {
            left: 'blue',
            right: 'missing',
          },
        },
      });
    });
  });
});
