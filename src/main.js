import yargs from 'yargs'

import Students from './commands/Students'

yargs.usage('Usage: ea-utils <command> [options]')
  .command('students:load', 'List students from the given Excel file (group by curriculum)', Students.load)
  .command('students:list', 'Get student list based on the result of students:load command (without duplication)', Students.list)
  .demand(1)
  .help('h')
  .alias('h', 'help')
  .argv
