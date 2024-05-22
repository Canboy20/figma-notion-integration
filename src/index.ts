import { Client } from "@notionhq/client";

import { getVariables } from "./api/Figma/GetVariables";
import { getFileNodes } from "./api/Figma/GetFileNodes";
import { getFigmaHeader } from "./utils/FigmaHeader";
import { queryDatabase } from "./api/Notion/QueryDatabase"
import { archivePageDatabase } from "./api/Notion/ArchivePageDatabase"
import { updatePageDatabase } from "./api/Notion/UpdatePageDatabase"
import { objectToMap } from "./utils/MapUtils"
import { addPageToDatabase } from "./api/Notion/AddPageToDatabase"
import { NotionTokenPage } from "./objects/NotionTokenPage"
import { DatabaseFieldTypes } from "./constants/Notion/DatabaseFieldTypes"
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors"
import dotenv from "dotenv";
import { figmaVariableObjectToNotionDatabasePageObject } from "./map/FigmaVariableObjectToNotionVariableObject";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getFileComponents } from "./api/Figma/GetFileComponents";
import { getFileComponentSets } from "./api/Figma/GetFileComponentSets";
import { getProjectFiles } from "./api/Figma/GetProjectFiles";
import { ErrorData } from "./objects/ErrorData";
import { ApiError } from "./objects/ApiError";
import { getFileStyles } from "./api/Figma/GetFileStyles";
import { getLibraryUsagesAnalytics } from "./api/Figma/GetLibraryUsagesAnalytics";
import { getLibraryActionsAnalytics } from "./api/Figma/GetLibraryActionsAnalytics";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const baseUrl = 'https://api.figma.com';



//const headers = new fetch.g


dotenv.config();

async function main() {


  const notion = new Client({
    auth: process.env.NOTION_KEY,
  });
  /*
    const response = await notion.databases.query({
      database_id: "FIXME",
    });
  
    console.log("Got response:", response);*/
}

app.get("/", cors(), (_req: Request, res: Response) => {
  res.send('Hello World!')
})

const listener = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
})


app.get("/getFigmaDesignTokens", cors(), async (req: Request, res: Response, next: NextFunction) => {

  //Fetch variables from FIGMA
  const figmaToken = process.env.FIGMA_KEY
  if (!figmaToken) {
    return next(new Error("Figma key UNDEFINED"));
  }

  let figmaPage = req.query.figmaPage;
  if (!figmaPage) {
    return next(new Error("Figma page is required"));
  }

  try {
    const fetchedUserData = await getVariables(baseUrl, figmaPage, getFigmaHeader(figmaToken))
    //let filteredUserData = fetchedUserData.filter((user) => user.id === parseInt(id as string));
    return res.status(200).send({ data: fetchedUserData });
  } catch (err) {
    next(err);
  }

});


app.get("/getFigmaFileComponents", cors(), async (req: Request, res: Response, next: NextFunction) => {

  //Fetch components from FIGMA
  const figmaToken = process.env.FIGMA_KEY
  if (!figmaToken) {
    return next(new Error("Figma key UNDEFINED"));
  }

  let figmaPage = req.query.figmaPage;
  if (!figmaPage) {
    return next(new Error("Figma page is required"));
  }

  try {

    const fetchedUserData = await getFileComponents(baseUrl, figmaPage, getFigmaHeader(figmaToken))
    return res.send({ data: fetchedUserData });

  } catch (err) {

    if (err instanceof ApiError) {
      return res.status(err.getStatusCode()).json({ message: err.getMessage() });
    }

    next(err);
  }

});

app.get("/getLibraryActionsAnalytics", cors(), async (req: Request, res: Response, next: NextFunction) => {

  //Fetch components from FIGMA
  const figmaToken = process.env.FIGMA_KEY
  if (!figmaToken) {
    return next(new Error("Figma key UNDEFINED"));
  }

  let figmaLibraryFileKey = req.query.libraryFileKey;
  if (!figmaLibraryFileKey) {
    return next(new Error("Figma library file key (libraryFileKey) query is required"));
  }

  let figmaGroupBy = req.query.groupBy;
  if (!figmaGroupBy) {
    return next(new Error("Figma group by (groupBy) query is required"));
  }

  try {

    const fetchedUserData = await getLibraryActionsAnalytics(baseUrl, figmaLibraryFileKey, figmaGroupBy, getFigmaHeader(figmaToken))
    return res.send({ data: fetchedUserData });

  } catch (err) {

    if (err instanceof ApiError) {
      return res.status(err.getStatusCode()).json({ message: err.getMessage() });
    }

    next(err);
  }

});

app.get("/getLibraryUsagesAnalytics", cors(), async (req: Request, res: Response, next: NextFunction) => {

  //Fetch components from FIGMA
  const figmaToken = process.env.FIGMA_KEY
  if (!figmaToken) {
    return next(new Error("Figma key UNDEFINED"));
  }

  let figmaLibraryFileKey = req.query.libraryFileKey;
  if (!figmaLibraryFileKey) {
    return next(new Error("Figma library file key (libraryFileKey) query is required"));
  }

  let figmaGroupBy = req.query.groupBy;
  if (!figmaGroupBy) {
    return next(new Error("Figma group by (groupBy) query is required"));
  }

  try {

    const fetchedUserData = await getLibraryUsagesAnalytics(baseUrl, figmaLibraryFileKey, figmaGroupBy, getFigmaHeader(figmaToken))
    return res.send({ data: fetchedUserData });

  } catch (err) {

    if (err instanceof ApiError) {
      return res.status(err.getStatusCode()).json({ message: err.getMessage() });
    }

    next(err);
  }

});



app.get("/design-system/components-documentation/:key", cors(), async (req: Request, res: Response, next: NextFunction) => {

  var componentKey = req.params.key;
  if (!componentKey) {
    return next(new Error("Component key UNDEFINED"));
  }

  const notion = new Client({ auth: process.env.NOTION_KEY });
  const pageId = process.env.NOTION_COMPONENTS_DOCUMENTATION_LINKS_PAGE_ID as string

  try {

    const newDb = await notion.databases.query({
      database_id: pageId,
      "filter": {
        "property": "Component Key",
        "rich_text": {
          "contains": componentKey
        }
      }
    })
    console.log("Component documentation " + JSON.stringify(newDb));
    res.json({ message: "success!", data: newDb })

  } catch (error) {

    next(error);

  }

});



app.get("/design-system/components-code-availability/:key", cors(), async (req: Request, res: Response, next: NextFunction) => {

  var componentKey = req.params.key;
  if (!componentKey) {
    return next(new Error("Component key UNDEFINED"));
  }

  const notion = new Client({ auth: process.env.NOTION_KEY });
  const pageId = process.env.NOTION_COMPONENTS_DOCUMENTATION_LINKS_PAGE_ID as string

  try {
    const newDb = await notion.databases.query({
      database_id: pageId,
      "filter": {
        "property": "Component Key",
        "rich_text": {
          "contains": componentKey
        }
      }
    })

    res.json({ message: "success!", data: newDb })

  } catch (error) {

    res.json({ message: "error", error })

  }

});


app.get("/getFigmaFileComponentSets", cors(), async (req: Request, res: Response, next: NextFunction) => {

  //Fetch components from FIGMA
  const figmaToken = process.env.FIGMA_KEY
  if (!figmaToken) {
    return next(new Error("Figma key UNDEFINED"));
  }

  let figmaPage = req.query.figmaPage;
  if (!figmaPage) {
    return next(new Error("Figma page is required"));
  }

  try {

    const fetchedUserData = await getFileComponentSets(baseUrl, figmaPage, getFigmaHeader(figmaToken));
    return res.send(fetchedUserData);

  } catch (err) {

    if (err instanceof ApiError) {
      return res.status(err.getStatusCode()).json({ message: err.getMessage() });
    }

    next(err);
  }

});


app.get("/getFigmaFileStyles", cors(), async (req: Request, res: Response, next: NextFunction) => {

  //Fetch components from FIGMA
  const figmaToken = process.env.FIGMA_KEY
  if (!figmaToken) {
    return next(new Error("Figma key UNDEFINED"));
  }

  let figmaFileKey = req.query.figmaFileKey;
  if (!figmaFileKey) {
    return next(new Error("Figma file key is required"));
  }

  try {

    const fetchedUserData = await getFileStyles(baseUrl, figmaFileKey, getFigmaHeader(figmaToken));
    return res.send(fetchedUserData);

  } catch (err) {

    if (err instanceof ApiError) {
      return res.status(err.getStatusCode()).json({ message: err.getMessage() });
    }

    next(err);
  }

});


app.get("/getFigmaProjectFiles", cors(), async (req: Request, res: Response, next: NextFunction) => {

  //Fetch components from FIGMA
  const figmaToken = process.env.FIGMA_KEY
  if (!figmaToken) {
    return next(new Error("Figma key UNDEFINED"));
  }

  let projectId = req.query.projectId;
  if (!projectId) {
    return next(new Error("Project Id is required"));
  }

  try {

    const fetchedUserData = await getProjectFiles(baseUrl, projectId, getFigmaHeader(figmaToken));
    return res.send(fetchedUserData);

  } catch (err) {

    if (err instanceof ApiError) {
      return res.status(err.getStatusCode()).json({ message: err.getMessage() });
    }

    next(err);
  }

});




app.get("/getNotionDesignTokens", async (req: Request, res: Response, next: NextFunction) => {

  //Fetch variables from Notion Database
  const notionToken = process.env.NOTION_KEY
  if (!notionToken) {
    return next(new Error("Notion key UNDEFINED"));
  }


  let databaseId = req.query.databaseId;
  if (!databaseId) {
    return next(new Error("Database Id is required"));
  }

  try {
    const databaseData = await queryDatabase(notionToken, databaseId, "")
    //let filteredUserData = fetchedUserData.filter((user) => user.id === parseInt(id as string));

    return res.status(200).send({ data: databaseData.results });
  } catch (err) {
    next(err);
  }

});


app.get("/getFigmaFileNodes", cors(), async (req: Request, res: Response, next: NextFunction) => {

  //Fetch variables from FIGMA
  const figmaToken = process.env.FIGMA_KEY
  if (!figmaToken) {
    return next(new Error("Figma key UNDEFINED"));
  }

  let figmaPage = req.query.figmaPage;
  if (!figmaPage) {
    return next(new Error("Figma page is required"));
  }

  let ids = req.query.ids;
  if (!ids) {
    return next(new Error("Node id is required"));
  }

  try {
    const fetchedUserData = await getFileNodes(baseUrl, figmaPage, getFigmaHeader(figmaToken), ids)
    return res.status(200).send({ fetchedUserData });
  } catch (err) {
    next(err);
  }

});

app.patch("/updateNotionPageDatabase", async (req: Request, res: Response, next: NextFunction) => {

  //Fetch variables from Notion Database
  const notionToken = process.env.NOTION_KEY
  if (!notionToken) {
    return next(new Error("Notion key UNDEFINED"));
  }

  let pageId = req.query.pageId;
  if (!pageId) {
    return next(new Error("Page Id is required"));
  }

  try {
    const databaseData = await updatePageDatabase(notionToken, pageId, "")
    //let filteredUserData = fetchedUserData.filter((user) => user.id === parseInt(id as string));
    return res.status(200).send({ data: databaseData });
  } catch (err) {
    next(err);
  }

});


app.get("/getProjectsMappedToLibrary", cors(), async (req: Request, res: Response, next: NextFunction) => {

  var libraryId = req.query.libraryId;
  if (!libraryId) {
    return next(new Error("LibraryId is UNDEFINED"));
  }

  const notion = new Client({ auth: process.env.NOTION_KEY });
  const pageId = process.env.NOTION_LIBRARY_PROJECTS_MAPPING_PAGE_ID as string

  try {

    const newDb = await notion.databases.query({
      database_id: pageId,
      "filter": {
        "property": "LibraryKey",
        "rich_text": {
          "contains": libraryId.toString()
        }
      }
    })

    res.json({ message: "success!", data: newDb })

  } catch (error) {

    next(error);

  }

});


app.get("/syncNotionTokensWithFigmaTokens", cors(), async (req: Request, res: Response, next: NextFunction) => {

  //Fetch variables from FIGMA
  const figmaToken = process.env.FIGMA_KEY
  if (!figmaToken) {
    return next(new Error("Figma key UNDEFINED"));
  }

  let figmaPage = req.query.figmaPage;
  if (!figmaPage) {
    return next(new Error("Figma page is required"));
  }

  //Fetch variables from NOTION
  const notionToken = process.env.NOTION_KEY
  if (!notionToken) {
    return next(new Error("Notion key UNDEFINED"));
  }

  let databaseId = req.query.databaseId;
  if (!databaseId) {
    return next(new Error("Database Id is required"));
  }


  let figmaVariables;
  try {
    const fetchedUserData = await getVariables(baseUrl, figmaPage, getFigmaHeader(figmaToken))
    figmaVariables = fetchedUserData.meta.variables;

  } catch (err) {
    next(err);
  }

  const figmaMap = objectToMap(figmaVariables)

  let notionVariables;
  //let variablesDataNotion: Array<any> = []

  //let figmaPagesMap = new Map<string, NotionTokenPage>()
  let notionPagesMap = new Map<string, NotionTokenPage>()

  try {

    const databaseData = await queryDatabase(notionToken, databaseId, "")
    //let filteredUserData = fetchedUserData.filter((user) => user.id === parseInt(id as string));
    databaseData.results.forEach((element) => {

      //Retrieve the details of each page
      var notionPageMap = objectToMap(element as PageObjectResponse)
      var notionPageId = notionPageMap.get(DatabaseFieldTypes.ID)
      var figmaId = notionPageMap.get(DatabaseFieldTypes.PROPERTIES)?.get('Figma ID')?.get(DatabaseFieldTypes.RICH_TEXT)?.get('0')?.get(DatabaseFieldTypes.PLAIN_TEXT)
      var notionPageProperties = notionPageMap.get(DatabaseFieldTypes.PROPERTIES)
      var notionTokenPage = new NotionTokenPage(notionPageId, figmaId, notionPageProperties)
      notionPagesMap.set(figmaId, notionTokenPage)
    }
    );


    /**
     * PART 1: Check if token already exists on Notion Database
     * If token already exists on Notion, add it to updateTokensList
     * If token doesn't exists on Notion, add it to createTokensList
     */
    let updateTokensList: string[] = [];
    let createTokensList: string[] = [];

    figmaMap.forEach((_value, key) => {
      if (notionPagesMap.has(key)) {
        updateTokensList.push(key)
      } else {
        createTokensList.push(key)
      }
    });


    /**
     * PART 2: Check if any tokens on Notion need to be removed. 
     * If token available on Notion doesn't exist on Figma, then add it to removePagesList
     * 
     *  */

    let removePagesList: string[] = [];
    notionPagesMap?.forEach((_value, key) => {
      if (!figmaMap.has(key)) {
        removePagesList.push(notionPagesMap.get(key)!!.getNotionId())
      }
    });

    console.log(removePagesList);


    //Update Pages
    for (let i = 0; i < updateTokensList.length; i++) {

      var pageDetails = figmaMap.get(updateTokensList[i])

      if (pageDetails) {
        await updatePageDatabase(notionToken, pageDetails.getNotionId(), figmaVariableObjectToNotionDatabasePageObject(pageDetails))
      }

    }

    //Create Pages
    for (let i = 0; i < createTokensList.length; i++) {

      await addPageToDatabase(notionToken, databaseId, figmaVariableObjectToNotionDatabasePageObject(figmaMap.get(createTokensList[i])))

    }

    //Archive pages
    for (let i = 0; i < removePagesList.length; i++) {
      await archivePageDatabase(notionToken, removePagesList[i])
    }


  } catch (err) {

    next(err);

  }

  return res.status(200).send("Sync Successfull");

});





