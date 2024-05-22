import fetch from "node-fetch"
import { ApiError } from "../../objects/ApiError";

export async function getFileNodes(baseUrl: any, fileKey: any, headers: any, ids: any) {

    let resp = await fetch(`${baseUrl}/v1/files/${fileKey}/nodes?ids=${ids}`, { headers });
    let data = await resp.json();

    if (!resp.ok) {
        throw new ApiError(resp.status, data)
    }

    return data;

}