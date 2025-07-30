import { Engine } from 'src/trace_processor/engine';
import { QueryResult, SqlValue } from 'src/trace_processor/query_result';
import { QueryEngine } from '@yschimke/mcp-perfetto-core';


export class PerfettoQueryEngine implements QueryEngine {
  engine: Engine;

  constructor(engine: Engine) {
    this.engine = engine;
  }

  async query(sql: string, tag?: string): Promise<string> {
    const results = await this.engine.query(sql, tag);
    return resultToJson(results);
  }
}

export async function resultToJson(result: QueryResult): Promise<string> {
  const columns = result.columns();
  const rows: unknown[] = [];
  for (const it = result.iter({}); it.valid(); it.next()) {
    const row: {[key: string]: SqlValue} = {};
    for (const name of columns) {
      let value = it.get(name);
      if (typeof value === 'bigint') {
        value = Number(value);
      }
      row[name] = value;
    }
    rows.push(row);
  }
  return JSON.stringify(rows);
}
