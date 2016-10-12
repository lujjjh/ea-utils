import formatter from '../formatter'

export default class {
  static load(yargs, argv) {
    argv = yargs.demand('f')
      .alias('f', 'file')
      .nargs('f', 1)
      .describe('f', 'Load a file')
      .demand('outputFormat')
      .nargs('outputFormat', 1)
      .default('outputFormat', 'json')
      .describe('outputFormat', 'Output format')
      .default('outputFormatOptions', [])
      .describe('outputFormatOptions', 'Options for formatter')
      .help('h')
      .alias('h', 'help')
      .argv

    const result = Tests.parse(argv.file)

    console.log(formatter[argv.outputFormat].stringify(result, argv.outputFormatOptions))
  }
}
