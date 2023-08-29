import { commands, ExtensionContext, WorkspaceConfiguration } from "vscode";
import { StateType } from "./globals/consts";
// import { Capability, isCapabilityEnabled } from "./capabilities/capabilities";
import  { openHubExternal } from "./hub/openHub";
import { workspace, window } from "vscode";

const CONFIG_COMMAND = "TabNine::config";
const CONFIG_EXTERNAL_COMMAND = "TabNine::configExternal";
export const STATUS_BAR_COMMAND = "TabNine.statusBar";

export function registerCommands(context: ExtensionContext): void {
  context.subscriptions.push(
    // commands.registerCommand(CONFIG_COMMAND, openHub(StateType.PALLETTE))
    // open vscode settings of tabnine
    commands.registerCommand(CONFIG_COMMAND, () => {
      commands.executeCommand("workbench.action.openSettings", "@ext:tabnine.tabnine-vscode");
    })
  );
  context.subscriptions.push(
    commands.registerCommand(
      CONFIG_EXTERNAL_COMMAND,
      openHubExternal(StateType.PALLETTE)
    )
  );
  context.subscriptions.push(
    commands.registerCommand(STATUS_BAR_COMMAND, handleStatusBar())
  );
}

function handleStatusBar() {
  return (): void => {
    // void commands.executeCommand(PROJECT_OPEN_GITHUB_COMMAND);
    // open a window to ask user to enable the extension or not
    let config = workspace.getConfiguration("ZZCoder");

    type Config = WorkspaceConfiguration & {
      enable: boolean;
    };

   const { enable } = config as Config;
  
   if (!enable) {
      void window.showInformationMessage(`CoderZZ is not running, do you want to enable it?`,
        "Enable"
      ).then(clicked => {
        if (clicked) {
          // set config to enable
          config.update("enable", true, true);
        }
      });
    }
    else {
      void window.showInformationMessage(`CoderZZ is running, do you want to disable it?`,
        "Disable"
      ).then(clicked => {
        if (clicked) {
          // set config to disable
          config.update("enable", false, true);
        }
      });
    }
  };
}
