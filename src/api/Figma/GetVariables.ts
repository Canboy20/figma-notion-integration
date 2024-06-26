import fetch from "node-fetch"
import { ApiError } from "../../objects/ApiError";

export async function getVariables(baseUrl: any, fileKey: any, headers: any) {

    let resp = await fetch(`${baseUrl}/v1/files/${fileKey}/variables/local`, { headers });
    let data = await resp.json();

    if (!resp.ok) {
        throw new ApiError(resp.status, data)
    }

    return data;

}