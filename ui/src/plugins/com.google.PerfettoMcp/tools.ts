import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Engine } from "src/trace_processor/engine";
import { z } from "zod";
import { runQueryForMcp } from "./query";

export function registerTools(server: McpServer, engine: Engine) {
    server.tool(
        "run-perfetto-trace-query",
        `
Tool to query a perfetto trace file.

The [query] param is SQL to execute against Perfetto's trace_processor.

If you are not sure about a query, then it's useful to show the SQL to the user and ask them to confirm.

The Perfetto SQL syntax is described here https://perfetto.dev/docs/analysis/perfetto-sql-syntax

Jank is a common topic and described here https://perfetto.dev/docs/data-sources/frametimeline, generally using [android_jank_cuj], or lower levels tables [actual_frame_timeline_slice], [expected_frame_timeline_slice]

Power is a less common topic and is described here https://perfetto.dev/docs/data-sources/battery-counters

CPU is described a bit here https://perfetto.dev/docs/data-sources/cpu-scheduling

Memory is described here https://perfetto.dev/docs/data-sources/memory-counters

Android logs are described here https://perfetto.dev/docs/data-sources/android-log        
        `,
        { query: z.string() },
        async ({ query }) => {
            const data = await runQueryForMcp(engine, query);
            return {
                content: [{ type: "text", text: data }]
            };
        }
    );

    server.tool(
        "list_android_processes",
        `
Tool to list processes.

This lists all the processes in the trace from the [package_list] with profileable and then debug apps first.  
        `,
        {},
        async ({ }) => {
            const data = await runQueryForMcp(engine,
                `select
package_name as packageName,
version_code as versionCode,
debuggable,
profileable_from_shell as profileable
from package_list
order by profileable desc, debuggable desc`);
            return {
                content: [{ type: "text", text: data }]
            };
        }
    );
}