import fetch from "node-fetch"

export async function getVariables(baseUrl: any, fileKey: any, headers: any) {

    let resp = await fetch(`${baseUrl}/v1/files/${fileKey}/variables/local`, { headers });
    console.log(resp)

    let data = await resp.json();
    
    return data;

}