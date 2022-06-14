export class Converter {
  // Convert an object passed into string format
  public static Stringify(message: any) {
    return `${typeof message === 'object' ? JSON.stringify(message) : message}`;
  }

  // Extract content from HTML tag
  public static ExtractTextFromHtmlTags(htmlString: string) {
    return htmlString.replace(/<(?:.|\n)*?>/gm, '');
  }

  // Extract content from HTML tag
  public static FormatContentWithMarkers(htmlString: string) {
    htmlString = Converter.ExtractTextFromHtmlTags(htmlString);
    return htmlString.replace(/&nbsp;/g, '');
  }

  public static SplitAnswerWithSteps(htmlString: string) {
    return htmlString.split(/[0-9]. +/);
  }

  public static RemoveFullStopAtTheEnd(htmlString: string) {
    return htmlString.replace(/[.]$/g, '');
  }
}
