#!/bin/bash

# Set the package name of your app
# packages list
# com.sudokunative.debug
# package:com.sudokunative.releaseStaging
# package:com.sudokunative.release

APP_PACKAGE_NAME="com.sudokunative.debug"
# APP_PACKAGE_NAME="com.sudokunative.releaseStaging"
# APP_PACKAGE_NAME="com.sudokunative.release"

# Set the interval (in seconds) at which you want to check the memory
INTERVAL=5

while true; do
    # Get the memory usage for the app
    MEMORY_INFO=$(adb shell dumpsys meminfo $APP_PACKAGE_NAME | grep 'TOTAL')

    # Print the current timestamp along with the memory usage
    echo "$(date) - $MEMORY_INFO"

    # Wait for the next interval
    sleep $INTERVAL
done
