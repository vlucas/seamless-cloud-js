/**
 * SQL Tagged Template Literal
 * Format returned is compatible with running queries on Seamless.cloud
 */
export function sql(strings: TemplateStringsArray, ...values: any[]) {
  let querySql = '';
  let queryVars: { [key: string]: any } = {};
  let index = 0;

  for (index = 0; index < values.length; index++) {
    const valueNumber: number = index + 1;
    const valuePlaceholder = '${' + valueNumber + '}';
    const value = values[index];

    queryVars[valueNumber] = value;
    querySql += strings[index] + valuePlaceholder;
  }

  querySql += strings[index];

  return {
    querySql: sqlFormat(querySql),
    queryVars,
  };
}

/**
 * Format SQL string to remove all extra whitespace and linebreaks, etc. that are NOT inside quotes
 * Standardizes the SQL string for matching, logging, and hashing.
 */
export function sqlFormat(sql: string): string {
  return sql.replace(/\s+(?=(?:[^\'"]*[\'"][^\'"]*[\'"])*[^\'"]*$)/g, ' ').trim();
}
