import { parseStringPromise } from "xml2js";
/**
 * Parses an XML string into a JavaScript object.
 * @param xmlString The XML string to parse.
 * @returns A promise that resolves to the parsed object.
 */
async function parseXml<T = any>(xmlString: string): Promise<T> {
  try {
    const result = await parseStringPromise(xmlString, {
      explicitArray: false,
      trim: true,
      mergeAttrs: true,
    });
    return result as T;
  } catch (error) {
    throw new Error(`Failed to parse XML: ${(error as Error).message}`);
  }
}

(async () => {
  const xml = `<note><to>User</to><from>Copilot</from><body>Hello!</body></note>`;
  const obj = await parseXml(xml);
  console.log(obj);
})();
