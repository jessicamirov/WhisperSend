#!/bin/bash
# Use this script to commit and publish changes to GitHub in Mac OS

# Make the Script Executable:
# In Terminal, navigate to the directory where your script is saved.
# Run chmod +x run_git.sh to make it executable.
# You can now run your script by typing ./run_git.sh in the Terminal while in the directory of your project.

# Get the current date in 'dd-mm-yy' format
formattedDate=$(date +"%d-%m-%y")

# Run Git commands
git status
git add .
git commit -m "$formattedDate"
git push -u origin main
