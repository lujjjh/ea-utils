import squel from 'squel'
import xlsx from 'xlsx'
import Console from '../utils/Console'
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

    /* load the specific file */
    let workbook = xlsx.readFile(argv.file)

    /* filter sheet names */
    const sheetNames = workbook.SheetNames.filter((name) => /^[\dA-Z]{8}./.test(name))

    /* process for each worksheet */
    const result = sheetNames.map((name) => {
      let sheet = workbook.Sheets[name]
      const rows = xlsx.utils.sheet_to_row_object_array(sheet)
      return {
        curriculum: {
          number: name.substring(0, 7),
          name: name.substring(8).replace(/^\s+|\s+$/, '')
        },
        students: rows.map((row) => ({
          number: row['F_ZKZNumber'].substring(2),
          name: row['F_StuName'],
          sex: row['F_StuSex'].indexOf('男') !== -1 ? 0 : 1,
          department: row['F_StuDept'],
          classNumber: row['F_TeacherNumber'],
          teacherName: row['F_TeacherName']
        }))
      }
    })

    console.log(formatter[argv.outputFormat].stringify(result, argv.outputFormatOptions))
  }

  static async list(yargs, argv) {
    argv = yargs.demand('inputFormat', 'outputFormat')
      .nargs('inputFormat', 1)
      .default('inputFormat', 'json')
      .describe('inputFormat', 'Input format')
      .nargs('outputFormat', 1)
      .default('outputFormat', 'json')
      .describe('outputFormat', 'Output format (json or sql)')
      .default('outputFormatOptions', [])
      .describe('outputFormatOptions', 'Options for formatter')
      .help('h')
      .alias('h', 'help')
      .argv

    let students = new Map()

    const curricula = formatter[argv.inputFormat].parse(await Console.readAll())
    curricula.forEach(curriculum => {
      curriculum.students.forEach(student => {
        students.set(student.number, {
          number: student.number,
          name: student.name,
          sex: student.sex,
          department: student.department
        })
      })
    })

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

    const result = [...students.values()]
      .sort((studentA, studentB) => +studentA.number - +studentB.number)
    console.log(formatter[argv.outputFormat].stringify(result, argv.outputFormatOptions))
  }
}
