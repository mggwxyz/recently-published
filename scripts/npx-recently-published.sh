#!/bin/bash

# Function to simulate typing
type_command() {
  echo -n "$1" | pv -qL 10  # Adjust the number (10) to control typing speed
  echo ""  # New line after command is "typed"
  eval "$1"  # Actually execute the command
  sleep 1  # Pause between commands
}

# Your commands to demonstrate
# type_command "npx recently-published"
echo "Hello, asciinema!"

