import formatter from '../src/formatter'

describe('formatter', () => {
  describe('json', () => {
    let json = formatter['json']

    describe('#stringify', () => {
      it('works', () => {
        expect(json.stringify([])).toBe('[]')
        expect(json.stringify({a: [1, 2, {b: true}]})).toBe('{"a":[1,2,{"b":true}]}')
      })

      it('works in prettify mode', () => {
        expect(json.stringify({a: [1, 2, {b: true}]}, {prettify: true})).toBe('{\n    "a": [\n        1,\n        2,\n' +
          '        {\n            "b": true\n        }\n    ]\n}')
      })
    })

    describe('#parse', () => {
      it('works', () => {
        expect(json.parse('[]')).toEqual([])
        expect(json.parse('{"a":[1,2,{"b":true}]}')).toEqual({a: [1, 2, {b: true}]})
      })
    })
  })
})
