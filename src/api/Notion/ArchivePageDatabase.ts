
import {Client} from "@notionhq/client"

export async function archivePageDatabase(notionToken: string, pageId: any) {

    const notion = new Client({
        auth: notionToken,
      })

    const page = await notion.pages.update({
        "page_id": pageId,
        archived: true
    })


    return page;

}




