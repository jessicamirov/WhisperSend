#!/bin/bash
# This script is used to set git repository in Mac OS
# To run use ./set_git.sh

# Make the Script Executable:
# In Terminal, navigate to the directory where your script is saved.
# Run chmod +x set_git.sh to make it executable.
# Now you can run your script by typing ./set_git.sh in the Terminal while in the directory of your project.

# Uncomment the following line to initialize the repository
# git init

git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/[set your github repository path].git
git push -u origin main