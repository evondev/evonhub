export function parseData(data: any[] | any): any {
  return JSON.parse(JSON.stringify(data));
}
