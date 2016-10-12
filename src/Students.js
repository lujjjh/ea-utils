import R from 'ramda'
import xlsx from 'xlsx'
import Console from './utils/Console'

export default class {
  static parse(path) {
    /* load the specific file */
    let workbook = xlsx.readFile(path)

    /* filter sheet names */
    const sheetNames = workbook.SheetNames.filter(name => /^[\dA-Z]{8}./.test(name))

    /* process for each worksheet */
    const result = sheetNames.map(name => {
      let sheet = workbook.Sheets[name]
      const rows = xlsx.utils.sheet_to_row_object_array(sheet)
      return {
        curriculum_number: name.substring(0, 8),
        students: rows.map(row => ({
          number: row['F_ZKZNumber'].substring(2),
          name: row['F_StuName'],
          sex: row['F_StuSex'].indexOf('男') !== -1 ? 0 : 1,
          department: row['F_StuDept'],
          classNumber: row['F_TeacherNumber'],
          teacherName: row['F_TeacherName']
        }))
      }
    })

    return result
  }
}
