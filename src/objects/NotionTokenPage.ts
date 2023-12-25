export class NotionTokenPage {
  private notionId: string;
  private figmaId: string;
  private properties: any;

  public constructor(notionId: string, figmaId: string, properties: any) {
    this.notionId = notionId;
    this.figmaId = figmaId;
    this.properties = properties;
  }

  public getNotionId(): string {
    return this.notionId;
  }

  public getFigmaId(): string {
    return this.figmaId;
  }

  public getProperties(): any {
    return this.properties;
  }

}
