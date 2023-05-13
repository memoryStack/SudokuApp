#!/bin/bash
# Accept the phone number of the receiver from user
# read -p "Enter the phone number of receiver in international format: " phoneNumber

# Executing the command and storing command output in the variable
# message="hi there"

# Replacing space, + sign with %20
# messages=`echo $message | sed 's/ /%20/g' | sed 's/+/%20/g'`

message=$(openssl base64 -in ./../nCk.cpp)

messages=`echo $message | sed 's/ /%20/g' | sed 's/+/%20/g'`

phoneNumber='+917988703146'

# Creating the link with phone number and command line output
link="https://web.whatsapp.com/send?phone=$phoneNumber&text=$messages"

open -a "Google Chrome" $link

say "Build Completed"

echo "Hello World" | mail -s "Test email" anujabo186@gmail.com