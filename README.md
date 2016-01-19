# ea-utils
[![Build Status](https://travis-ci.org/lujjjh/ea-utils.svg?branch=master)](https://travis-ci.org/lujjjh/ea-utils)

EA utilities.

## Installation
    npm install
    npm link

## Usage
    Usage: ea-utils <command> [options]
    
    Commands:
      students:load  List students from the given Excel file (group by curriculum)
      students:list  Get student list based on the result of students:load command
                     (without duplication)
    
    Options:
      -h, --help  Show help                                                [boolean]

### students:load
    Options:
      -f, --file             Load a file                                  [required]
      --outputFormat         Output format              [required] [default: "json"]
      --outputFormatOptions  Options for formatter                     [default: []]
      -h, --help             Show help                                     [boolean]

### students:list
    Options:
      --inputFormat          Input format               [required] [default: "json"]
      --outputFormat         Output format (json or sql)           [default: "json"]
      --outputFormatOptions  Options for formatter                     [default: []]
      -h, --help             Show help                                     [boolean]
