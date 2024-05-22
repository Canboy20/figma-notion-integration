import fetch from "node-fetch"
import { ErrorData } from "../../objects/ErrorData";
import { APIErrorCode } from "@notionhq/client";
import { ApiError } from "../../objects/ApiError";

export async function getLibraryActionsAnalytics(baseUrl: any, libraryFileKey: any, groupBy: any, headers: any) {

    let resp = await fetch(`https://api.figma.com/v1/analytics/libraries/${libraryFileKey}/actions?group_by=${groupBy}`, { headers });
    let data = await resp.json();

    if (!resp.ok) {
        throw new ApiError(resp.status, data)
    }

    return data;

}