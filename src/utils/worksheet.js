import R from 'ramda'
import xlsx from 'xlsx'

export let cellEqual = R.curry((sheet, v, r, c) => {
  let cell = sheet[xlsx.utils.encode_cell({ r: r, c: c })]
  return cell && cell.v === v
})

export let cellNotEmpty = R.curry((sheet, r, c) => {
  let cell = sheet[xlsx.utils.encode_cell({ r: r, c: c })]
  return cell && cell.v
})

export let cellProperty = R.curry((sheet, property, r, c) => {
  return sheet[xlsx.utils.encode_cell({ r: r, c: c })][property]
})

export let cellValue = cellProperty(R.__, 'v')

export let cellValueKV = R.curry((sheet, cell) => cellValue(sheet, cell.r, cell.c))
