---
title: Bash, Vim & Regex
date: "2020-03-12T20:39:13.695Z"
description: "Notes from https://frontendmasters.com/courses/bash-vim-regex/"
tags: ["notes"]
---

# Bash / Vim / Regex

## Bash

Kernel

- CPU scheduling of when programs get to use CPU time
- Allocates a program's usage of memory and stops programs reading from each others' memory allocations
- Allows programs to be agnostic of the type of hardware installed ( i.e. which network card is installed )

Shell

- Computer program that can execute other programs via a command line interface
- `man <command>` will print help about that command
- `alias` will print all the active aliases
- `ctrl + d` exit gracefully, `ctrl + c` will exit forcefully.

## File Management

reset

- sometimes the terminal will be in a weird state. try typing `reset` and `enter`
  cp
- copy multiple files into a directory with `cp file1.txt file2.txt somedir/`
- copy a folder directory recursively `cp -r source-folder destination-folder`

mv

- effectively just renaming the directory

mkdir

- make directory recursively `mkdir -p a/b/c/d`

wc

- `wc` will tell you the words, characters, and lines in a file

wildcards & brace expansions

- use `echo` to print what a brace expansion would evaluate to
- `touch test{1,2,3}.txt` will expand to `touch test1.txt test2.txt test3.txt`
- Specify a range `touch test{1..10}.txt` will expand to `touch test1.txt test2.txt test3.txt test4.txt test5.txt test6.txt test7.txt test8.txt test9.txt test10.txt`
- a step can be specified `touch test{1..10..2}.txt` which will expand to `touch test1.txt test3.txt test5.txt test7.txt test9.txt`
- `cat *.txt` will expand all files ending in `.txt` in the current directory
- brace expansions will generate permutations `touch {1,2,3}-{cat,dog}-{.png,.txt}` will expand to `touch 1-cat-.png 1-cat-.txt 1-dog-.png 1-dog-.txt 2-cat-.png 2-cat-.txt 2-dog-.png 2-dog-.txt 3-cat-.png 3-cat-.txt 3-dog-.png 3-dog-.txt`

writing and reading files

- `>` will redirect the output into another command
- `>>` will append to a file
- For programs that require standard input, the `<` character can provide the input into the command from a file

## Pipes

Used for composing different commands i.e `ls -1 *.txt | wc -l` will print the number of text files in a directory

date

- `date +'%H:%M:%S'` will print the time with the format `11:38:02`

Backticks

- Allow output of a program in the arguments list of another i.e `` echo `date` ``
- Equivalent to using `$()` i.e `echo $(date)`

Utilities

- Print the command history with `history`
- Print env variables with `export`
- Assign variable with `MSG='test'`, to access the environment variable in another shell i.e. `node` by using `export MSG='test'`
- Single quotes will result in the literal string, where as double quotes will allow environment variables

## Scripts

Must start with `!#/bin/bash`
Need to set permissions on the script with `chmod +x <filename>`

- Script that takes input from standard input
  - `echo -n 'what is your name?'`
  - `read NAME`
  - `echo "hello $NAME!"`
- Arguments are provided as env variables by position, i.e `$1, $2, $3`

Loops

- `for X in {0..10}; echo $X; done`
- `while true; do date; sleep 1; done`

Path

- `echo $PATH` to inspect the path
- Will match the first match

Permissions

- `u` user `g` group `o` other
- Executable for files means run it, for directories it means list the contents
- Order is `read` `write` `execute`
- Can be set with number shorthand ( plus together for permissions )

  - `4` = write
  - `2` = read
  - `1` = execute

- `ls -l` will print the permissions ( i.e. `-rwxr-xr-x` ) means `rwx` for user, `r-x` for group and `r-x` for other
- `chmod` will set permissions
  - To add write permission to group `chmod g+w <filename>`
  - To remove write permissions `chmod g-w <filename>`

Exit codes

- `echo $?` will print the exit code for the the last command
- `||` is the opposite of `&&` and will execute the second command if the first exits with a non 0 code
- A subshell can will execute within its own context ( i.e. for this, `exit` would usually close the terminal, but here it doesn't ) `(if test -f does-exist.txt; then exit 1; else exit 2; fi); echo $?`

Job Control

- `ctrl + z` puts a process from the foreground to the background. Resume the program with `fg`. `jobs` will tell you what jobs are running. Then use `fg %2` to jump bring the second job to the foreground.
- `kill %2` will then try to kill that job. Force close with `kill -9 %2` since it will tell the kernal to force close the app and it can't be intercepted by the application ( applications can choose which signals they response to, except that one )
- Place a program into the background immediately by ending with a `&` i.e. `watch -n1 date &` however it will start stopped, so you can use `bg` to start it
- `kill %%` will kill all jobs
- Can have multiple `screen`s open at once

## Regular Expressions

- Regex can be used in `sed` to replace characters
