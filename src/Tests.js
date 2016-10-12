import R from 'ramda'
import xlsx from 'xlsx'
import { cellEqual, cellNotEmpty, cellValue, cellValueKV } from './utils/worksheet'
import { matchAll } from './utils/regexp'

export default class {
  static parse(path) {
    /* load the specific file */
    let workbook = xlsx.readFile(path)

    /* filter sheet names */
    const sheetNames = workbook.SheetNames.filter(name => /^\d{4}(\-\d\d?){2}$/.test(name))

    /* process for each worksheet */
    const result = sheetNames
      .map(name => {
        let date = name
        let sheet = workbook.Sheets[name]
        const sheetRange = xlsx.utils.decode_range(sheet['!ref'])

        let sheetCellEqual = cellEqual(sheet)
        let sheetCellNotEmpty = cellNotEmpty(sheet)
        let sheetCellValue = cellValue(sheet)
        let sheetCellValueKV = cellValueKV(sheet)

        let getTestName = R.pipe(R.evolve({ r: R.inc }),
          sheetCellValueKV,
          R.replace(/\(.+\)/, ''))

        let getTestTime = R.pipe(sheetCellValueKV,
          R.match(/(\d\d?:\d{2})~(\d\d?:\d{2})/),
          R.props([1, 2]),
          R.map(R.pipe(R.of, R.prepend(date), R.join(' '))),
          R.zipObj(['start', 'end']))

        let parseArrangement = R.pipe(matchAll(/(\d+)\s*[\(（]\s*([\dA-Z]+)\s*\-\s*(\d+)\s*[\)）]/g),
          R.map(R.pipe(R.props([1, 2, 3]),
          R.zipObj(['count', 'curriculmnNumber', 'classNumber']))))

        let parseLocation = R.pipe(R.match(/^[^\(]+/), R.prop(0), R.trim)

        let getTestArrangements = R.pipe(R.evolve({ r: R.add(2) }),
          R.over(R.lensProp('r'), R.range(R.__, sheetRange.e.r)),
          R.converge(R.xprod, [
            R.prop('r'),
            R.pipe(R.prop('c'), R.of)
          ]),
          R.takeWhile((rc) => sheetCellNotEmpty(rc[0], 0)),
          R.filter(R.apply(sheetCellNotEmpty)),
          R.map(R.pipe(
            R.converge(R.concat, [
              R.pipe(R.apply(sheetCellValue), parseArrangement, R.of),
              R.pipe(R.update(1, 0), R.apply(sheetCellValue), parseLocation, R.of)
            ]),
            R.zipObj(['arrangements', 'location']))))

        return R.range(2, sheetRange.e.r)
          .filter(sheetCellEqual('考试时间', R.__, 0))
          .map(r => {
            return R.range(1, 4)
              .filter(sheetCellNotEmpty(r))
              .map(c => ({ r: r, c: c }))
          })
          .reduce(R.concat, [])
          .map(row => ({
            name: getTestName(row),
            time: getTestTime(row),
            arrangements: getTestArrangements(row)
          }))
      })

    return R.flatten(result)
  }
}
