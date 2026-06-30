export type PropertyRow = {
  name: string;
  type: string;
  status?: "optional" | "required";
  description: React.ReactNode;
};

export function PropertiesTable({ rows }: { rows: PropertyRow[] }) {
  return (
    <div className="border-border overflow-x-auto border">
      <table className="w-full min-w-3xl border-collapse text-sm">
        <thead className="bg-panel-muted text-left">
          <tr>
            <th className="border-border border-b px-4 py-3 font-semibold">Property</th>
            <th className="border-border border-b px-4 py-3 font-semibold">Type</th>
            <th className="border-border border-b px-4 py-3 font-semibold">Status</th>
            <th className="border-border border-b px-4 py-3 font-semibold">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-border border-b last:border-b-0">
              <td className="px-4 py-3 align-top">
                <code className="text-foreground bg-background rounded-sm px-1.5 py-0.5 font-mono text-xs">
                  {row.name}
                </code>
              </td>
              <td className="text-muted-foreground px-4 py-3 align-top font-mono text-xs">
                {row.type}
              </td>
              <td className="text-muted-foreground px-4 py-3 align-top text-xs">
                {row.status ?? "optional"}
              </td>
              <td className="text-foreground px-4 py-3 align-top leading-6">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
