import R from 'ramda'

export let matchAll = R.curry((pattern, string) => {
  let match
  let result = []
  while ((match = pattern.exec(string))) {
    result.push(match)
  }
  return result
})
