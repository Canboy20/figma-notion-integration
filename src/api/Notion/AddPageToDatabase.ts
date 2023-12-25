import { Client } from "@notionhq/client"

export async function addPageToDatabase(notionToken: string, databaseId: any, properties: any) {

    const notion = new Client({
        auth: notionToken,
    })


    const page = await notion.pages.create({
        parent: {
            database_id: databaseId,
        },
        properties: properties,
    })

    //Print the new database response
    //console.log(page)
    console.log("Token added to Notion Database")
}