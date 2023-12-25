export function getFigmaHeader(figmaToken: string): Headers {

        const requestHeaders: HeadersInit = new Headers();
        requestHeaders.set('X-Figma-Token', figmaToken);
        return requestHeaders

}