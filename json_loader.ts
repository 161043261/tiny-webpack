export function jsonLoader(sourceCode: string): string {
  this.addDeps?.("jsonLoader");
  return `export default ${JSON.stringify(sourceCode)}`;
}
