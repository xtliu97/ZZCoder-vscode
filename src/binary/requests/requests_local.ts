
import fetch from "node-fetch";

import { AutocompleteParams, AutocompleteResult, localApiMetadata } from "./requests";



export type AutocompleteParamsLocal = {
    inputs: string;
}

export type AutocompleteResultLocal = {
    generated_text: string
    api_response_time: number
    status_code: number
    error_message: string
}


export function buildAutocompleteParamsLocal(
    params: AutocompleteParams
) {
    const startToken = "<fim_prefix>";
    const middleToken = "<fim_middle>";
    const endToken = "<fim_suffix>";
    // const endText = "<|endoftext|>";
    if (params.before.trim()){
        return {
            inputs: startToken + params.before + endToken + params.after + middleToken
        };
    }else{
        return {
            inputs: params.before
        };
    }
}

export function buildAutocompleteResultLocal(
    result: AutocompleteResultLocal, prev_old_prefix: string = "", prev_old_suffix: string = ""
): AutocompleteResult {
    // const new_old_prefix = result.generated_text.split("<fim_prefix>")[1].split("<fim_middle>")[0].replace(prev_old_prefix, "");
    const new_old_suffix = prev_old_suffix;
    const new_prefix = result.generated_text.split("<fim_middle>")[1].replace("<fim_suffix>", "").replace("<|endoftext|>","");
    // const new_suffix = result.generated_text.split("<fim_middle>")[1].replace("<fim_suffix>", "");
    
    const res : AutocompleteResult = {
        results: [{
            new_prefix: new_prefix,
            old_suffix: new_old_suffix,
            new_suffix: '',
            completion_metadata: localApiMetadata,
        }],
        old_prefix:  "",
        user_message: [],
        is_locked: false
    }
    return res;
}
        

export class LocalServer {
    api : string = "http://localhost:8000/code/completion_tabnine";

    async request(params: AutocompleteParamsLocal) 
        : Promise<AutocompleteResultLocal> {

        const response = await fetch(this.api, {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }
        const payload : any = await response.json();

        const result : AutocompleteResultLocal = {
            generated_text: payload.generated_text,
            api_response_time: payload.api_response_time,
            status_code: payload.status_code,
            error_message: payload.error_message
        }
        
        return result;
    }
}

export async function autocomplete_local(
    requestData: AutocompleteParams,
    timeout?: number
  ): Promise<AutocompleteResult | undefined | null> {
    const localServer = new LocalServer();
    const requestLocal = buildAutocompleteParamsLocal(requestData);
    const localResult = await localServer.request(requestLocal);
    const result = buildAutocompleteResultLocal(localResult, requestData.before, requestData.after);
    return result;
    }
