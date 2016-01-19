import winston from 'winston'

export default new winston.Logger({
  level: 'info',
  transports: [
    new (winston.transports.Console)()
  ]
})
