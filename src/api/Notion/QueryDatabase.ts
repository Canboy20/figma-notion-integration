import {Client} from "@notionhq/client"

export async function queryDatabase(notionToken: string, databaseId: any, filterProperties: any) {

    const notion = new Client({
        auth: notionToken,
      })

    const page = await notion.databases.query({
        "database_id": databaseId
    })

    //Print the new database response
    console.log(page)

    return page

}