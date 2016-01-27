import yargs from 'yargs'

import Students from './commands/Students'
import Tests from './commands/Tests'

yargs.usage('Usage: ea-utils <command> [options]')
  .command('students:load', 'List students from the given Excel file (group by curriculum)', Students.load)
  .command('students:list', 'Get student list based on the result of students:load command (without duplication)', Students.list)
  .command('tests:load', 'List tests from the given Excel file (group by test number)', Tests.load)
  .demand(1)
  .help('h')
  .alias('h', 'help')
  .argv
