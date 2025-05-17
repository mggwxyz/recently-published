#!/bin/bash

# Function to simulate typing
type_and_execute_command() {
  echo "$1" | pv -qL 10  # Adjust the number (10) to control typing speed
  eval "$1"  # Actually execute the command
}

# Your commands to demonstrate
type_and_execute_command "npx recently-published"

exit 0
