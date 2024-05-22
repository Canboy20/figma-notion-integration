import {Client} from "@notionhq/client"

export async function updatePageDatabase(notionToken: string, pageId: any, properties: any) {

    const notion = new Client({
        auth: notionToken,
      })

    const page = await notion.pages.update({
        "page_id": pageId,
        "properties": properties
    })

    return page;

}