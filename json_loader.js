export function jsonLoader(sourceCode) {
  this.addDeps?.("jsonLoader");
  return `export default ${JSON.stringify(sourceCode)}`;
}
