import squel from 'squel'
import formatter from '../formatter'

import Students from '../Students'

export default class {
  static parse(yargs, argv) {
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

    let result = Students.parse(argv.file)

    /* extend sql formatter */
    formatter['sql'] = class {
      static stringify(students, options) {
        options = {
          driver: 'mysql',
          tableName: 'students',
          columns: {
            number: 'number',
            name: 'name',
            sex: 'sex',
            department: 'department'
          }
        }
        let sqlBuilder = squel.useFlavour(options.driver)
        return students.map(student => {
          return sqlBuilder.insert()
            .into(options.tableName)
            .set(options.columns.number, student.number)
            .set(options.columns.name, student.name)
            .set(options.columns.sex, student.sex)
            .set(options.columns.department, student.department)
            .toString() + ';'
        }).join('\n')
      }
    }

    console.log(formatter[argv.outputFormat].stringify(result, argv.outputFormatOptions))
  }
}
