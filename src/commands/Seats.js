import R from 'ramda'
import squel from 'squel'
import formatter from '../formatter'
import Students from '../Students'
import Tests from '../Tests'

export default class {
  static parse(yargs, argv) {
    argv = yargs.demand('student-file')
      .alias('s', 'studentFile')
      .nargs('s', 1)
      .demand('arrangement-file')
      .alias('a', 'arrangementFile')
      .nargs('a', 1)
      .demand('trimester-id')
      .alias('t', 'trimesterId')
      .demand('outputFormat')
      .nargs('outputFormat', 1)
      .default('outputFormat', 'json')
      .describe('outputFormat', 'Output format')
      .default('outputFormatOptions', [])
      .describe('outputFormatOptions', 'Options for formatter')
      .help('h')
      .alias('h', 'help')
      .argv

    let curriculums = Students.parse(argv.studentFile)
    let studentsMap = {}

    curriculums.forEach(curriculum => {
      studentsMap[curriculum.curriculum_number] =
        R.groupBy(student => student.classNumber, curriculum.students)
    })

    let tests = Tests.parse(argv.arrangementFile)

    let result = []

    tests.forEach(test => {
      const arrangements = test.arrangements

      arrangements.forEach(arrangement => {
        const location = arrangement.location

        let number = 0

        arrangement.arrangements.forEach(batch => {
          const count = batch.count
          const curriculmnNumber = batch.curriculmnNumber
          const classNumber = batch.classNumber

          for (let i = 0; i < count; i++) {
            let student = studentsMap[curriculmnNumber][classNumber].shift()
            result.push({
              curriculmnNumber: curriculmnNumber,
              classNumber: classNumber,
              testName: test.name,
              location: location,
              student: student,
              number: ++number
            })
          }
        })
      })
    })

    formatter['sql'] = {
      stringify(result) {
        return result.map(seat => {
          return `INSERT INTO seats (cid, clid, tid, stid, location, number) VALUES (` +
            `(SELECT cid FROM curriculums WHERE number = '${seat.curriculmnNumber}'), ` +
            `(SELECT clid FROM classes WHERE trid = ${argv.trimesterId} AND cid = (SELECT cid FROM curriculums WHERE number = '${seat.curriculmnNumber}') AND number = ${seat.classNumber}), ` +
            `(SELECT tid FROM tests WHERE trid = ${argv.trimesterId} AND name = '${seat.testName}'), ` +
            `(SELECT stid FROM students WHERE number = ${seat.student.number}), ` +
            `'${seat.location}', '${seat.number}');`
        }).join('\n')
      }
    }

    console.log(formatter[argv.outputFormat].stringify(result, argv.outputFormatOptions))
  }
}
