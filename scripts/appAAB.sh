cd './android'

./gradlew clean bundleRelease

# copy the file
cp ./app/build/outputs/bundle/release/app-release.aab ~/Desktop/SudokuAAB.aab

say "Build Completed"
