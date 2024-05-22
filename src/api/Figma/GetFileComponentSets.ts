import fetch from "node-fetch"
import { ApiError } from "../../objects/ApiError";

export async function getFileComponentSets(baseUrl: any, figmaPage: any, headers: any) {

    let resp = await fetch(`https://api.figma.com/v1/files/${figmaPage}/component_sets`, { headers });
    let data = await resp.json();

    if (!resp.ok) {
        throw new ApiError(resp.status, data)
    }

    return data;

}