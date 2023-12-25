import fetch from "node-fetch"

export async function getFileNodes(baseUrl: any, fileKey: any, headers: any, nodeId: any) {

    let resp = await fetch(`${baseUrl}/v1/files/${fileKey}/nodes?ids=${nodeId}`, { headers });
    console.log(resp)

    //let data = await resp.json();
    
    return resp;

}