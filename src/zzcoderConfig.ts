import { WorkspaceConfiguration } from "vscode";

type Config = WorkspaceConfiguration & {
    enable: boolean;
    modelIdOrEndpoint: string;
    isFillMode: boolean;
    startToken: string;
    middleToken: string;
    endToken: string;
    stopToken: string;
    temperature: number;
    maxTimeOut: number;
    maxNewTokens: number;
};

export default Config;
