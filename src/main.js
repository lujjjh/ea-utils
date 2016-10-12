import yargs from 'yargs'

import Seats from './commands/Seats'
import Students from './commands/Students'
import Tests from './commands/Tests'

yargs.usage('Usage: ea-utils <command> [options]')
  .command('students:parse', 'List students from the given Excel file (group by curriculum)', Students.parse)
  .command('tests:load', 'List tests from the given Excel file (group by test number)', Tests.load)
  .command('seats', 'Parse seats', Seats.parse)
  .demand(1)
  .help('h')
  .alias('h', 'help')
  .argv
