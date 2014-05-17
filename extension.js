
/*
 * Show Desktop from Overview
 * Very small extension which minimizes all windows when you click on an empty space in the windows-overview-mode.
 * Version for Gnome-Shell 3.6 and 3.8
 *
 * Changelog:
 *
 * Version 7: Compatibility for Gnome-Shell 3.12: removed tracker.is_window_interesting as it doesn't exist anymore
 * Version 6: Compatibility for Gnome-Shell 3.10
 * Version 5: Compatibility for Gnome-Shell 3.8
 * Version 3&4: Don't minimize icons on desktop if shown there
 *
 * Contact:
 * bazonbloch@arcor.de
 * Feel free to send improvments!
*/

const Main = imports.ui.main;
const Shell = imports.gi.Shell;

var connectid = null;
var reactiveBefore = null;

function _showDesktop() {
    //TODO: when public, do that by meta_screen_show_desktop();
    
    let activeWorkspace = global.screen.get_active_workspace();
    let tracker = Shell.WindowTracker.get_default();
    let windows = activeWorkspace.list_windows();
    for (let i = 0; i < windows.length; i++) {
           //New in V3&4: tracker.is_window_interesting checks whether this is a real window and not a desktop icon
           if (!windows[i].minimized && (windows[i].get_window_type() == 0)) {
	       windows[i].minimize();
           }
    }
    Main.overview.hide();
}

function init() {
    reactiveBefore=Main.overview.viewSelector._workspacesDisplay.actor.reactive;
    //normal: false. but maybe set by another extension.
}

function enable() {
    Main.overview.viewSelector._workspacesDisplay.actor.reactive=true;
    connectid = Main.overview.viewSelector._workspacesDisplay.actor.connect('button-press-event', _showDesktop);
    //if you want to swipe workspaces (like Dr_g00f in comments) from overview use this instead:
    //connectid = Main.overview._viewSelector._workspacesDisplay.actor.connect('button-release-event', _showDesktop);
    //in Gnome-Shell 3.6: shows desktop when button released
    //in Gnome-Shell 3.8: shows desktop when desktop is doubleclicked. whyever.
}

function disable() {
    //set back to default value which is normally false.
    Main.overview.viewSelector._workspacesDisplay.actor.reactive=reactiveBefore;
    Main.overview.viewSelector._workspacesDisplay.actor.disconnect(connectid);
}
