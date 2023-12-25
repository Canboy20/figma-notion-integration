import { getTokenTierType, getTokenType } from "../utils/TokenUtils"

export function figmaVariableObjectToNotionDatabasePageObject(figmaVariableObject: any) {
  console.log("Object is")

  console.log(figmaVariableObject)

  var variableValue = figmaVariableObject.get('name')
  var variableTier = getTokenTierType(figmaVariableObject.get('name'))
  var variableType = getTokenType(figmaVariableObject.get('resolvedType'))
  var figmaId = figmaVariableObject.get('id')


  let notionDatabasePageObject = {
    "Token Name": {
      "type": "title",
      "title": [{ "type": "text", "text": { "content": variableValue } }],
    },
    "Token Tier": {
      "select": {
        "name": variableTier
      }
    },
    "Token Type": {
      "select": {
        "name": variableType
      }
    },
    "Figma ID": {
        "type": "rich_text",
        "rich_text": [{ "type": "text", "text": { "content": figmaId } }],
      }
  }

  return notionDatabasePageObject;

}