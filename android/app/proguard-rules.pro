# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
# these options are added because of eabling hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# react-native-svg
-keep public class com.horcrux.svg.** {*;}

# sudoku puzzle class
-keep class com.anujrao.sudokucpp.PuzzleInfo { *; }

# sudoku puzzle solutions count checker class
-keep class com.anujrao.sudokucpp.PuzzleValidationResult { *; }

# sudoku hints classes
-keep class com.anujrao.sudokucpp.** { *; }
