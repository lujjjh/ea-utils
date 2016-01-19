import process from 'process'

export default class {
  static async readAll() {
    return new Promise(resolve => {
      let data = ''
      process.stdin.resume()
      process.stdin.setEncoding('utf-8')
      process.stdin.on('data', chunk => data += chunk)
      process.stdin.on('end', () => {
        resolve(data)
      })
    })
  }
}
