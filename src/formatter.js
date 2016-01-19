class JsonFormatter {
  static stringify(object, options) {
    options = {
      space: options.beautify ? '    ' : null
    }
    return JSON.stringify(object, null, options.space)
  }

  static parse(string) {
    return JSON.parse(string)
  }
}

export default {
  json: JsonFormatter
}
