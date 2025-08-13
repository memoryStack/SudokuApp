package com.sudokunative;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import android.view.View;
import android.view.KeyEvent;

public class MainActivity extends ReactActivity {
    private KeyEventModule keyEventModule;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);
        hideSystemUI();
    }

    private void hideSystemUI() {
        getWindow().getDecorView().setSystemUiVisibility(
                // below checks so that full screen mode enables and status bar and bottom nav
                // bars can be
                // accessed when user will drag from up or bottom
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        // | View.SYSTEM_UI_FLAG_FULLSCREEN
                        | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                        // below checks so that layout doesn't resize and UI won't flicker
                        | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemUI();
        }
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule
     * rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "SudokuNative";
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (this.keyEventModule != null) {
            this.keyEventModule.onKeyDown(keyCode, event);
        }
        return true;
        // return super.onKeyDown(keyCode, event);
    }

    public void setKeyEventModule(KeyEventModule module) {
        this.keyEventModule = module;
    }
}
