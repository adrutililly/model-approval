import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge, type StatusColor } from "@/components/status-badge"
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ALLOWED_EMAILS } from "@/lib/auth-middleware";
import { toast } from "sonner";

export interface ModelData {
  id: number
  model: string
  version: string
  category: string
  infrastructure: string
  license: string
  legal: string
  cyber: string
  procurement: string
  comments: string
}

interface ModelTableProps {
  filteredData: ModelData[]
  totalCount: number
  onUpdate?: () => void
}

const STATUS_OPTIONS = [
  "submitted",
  "in review",
  "green",
  "yellow",
  "orange",
  "red",
  "rejected",
  "depreciated"
];

export function ModelTable({ filteredData, totalCount, onUpdate }: ModelTableProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.email && ALLOWED_EMAILS.includes(session.user.email);
  const [editRows, setEditRows] = useState<{ [id: number]: { legal?: string; cyber?: string; procurement?: string; comments?: string } }>({});
  const [saving, setSaving] = useState<number | null>(null);

  const handleChange = (id: number, field: "legal" | "cyber" | "procurement" | "comments", value: string) => {
    setEditRows((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  };

  const handleSave = async (id: number) => {
    setSaving(id);
    const update = editRows[id];
    try {
      // Update the model status
      const modelResponse = await fetch("/api/models", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...update })
      });

      if (!modelResponse.ok) {
        throw new Error("Failed to update model status");
      }

      // Log the update
      const logResponse = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modelId: id,
          legal: update.legal,
          cyber: update.cyber,
          procurement: update.procurement,
          comments: update.comments
        })
      });

      if (!logResponse.ok) {
        throw new Error("Failed to log update");
      }

      toast.success("Update saved successfully");
      setEditRows((prev) => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
      
      // Call the onUpdate callback to refresh the data
      onUpdate?.();
    } catch (error) {
      console.error("Error saving update:", error);
      toast.error("Failed to save update");
    } finally {
      setSaving(null);
    }
  };

  return (
    <Card className="border-red-200 shadow-md">
      <CardHeader className="bg-[#e1241b] px-4 py-2">
        <CardTitle className="text-white text-xl leading-tight">AI Model Status Overview</CardTitle>
        <CardDescription className="text-red-100 text-xs mt-1">
          Showing {filteredData.length} of {totalCount} models
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="rounded-md border border-red-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-red-50">
              <TableRow>
                <TableHead className="font-semibold text-[#d52b1e]">Model</TableHead>
                <TableHead className="font-semibold text-[#d52b1e]">Version</TableHead>
                <TableHead className="font-semibold text-[#d52b1e]">Category</TableHead>
                <TableHead className="font-semibold text-[#d52b1e] text-center">Legal</TableHead>
                <TableHead className="font-semibold text-[#d52b1e] text-center">Cyber</TableHead>
                <TableHead className="font-semibold text-[#d52b1e] text-center">Procurement</TableHead>
                <TableHead className="font-semibold text-[#d52b1e]">Infrastructure</TableHead>
                <TableHead className="font-semibold text-[#d52b1e]">License</TableHead>
                <TableHead className="font-semibold text-[#d52b1e]">Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No models found matching your criteria
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => {
                  const edit = editRows[item.id] || {};
                  return (
                    <TableRow key={item.id} className="hover:bg-red-50/50">
                      <TableCell className="font-medium">{item.model}</TableCell>
                      <TableCell>{item.version}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-center">
                        {isAdmin ? (
                          <select
                            value={edit.legal ?? item.legal}
                            onChange={e => handleChange(item.id, "legal", e.target.value)}
                            className="border rounded px-2 py-1"
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <StatusBadge status={item.legal as StatusColor} />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {isAdmin ? (
                          <select
                            value={edit.cyber ?? item.cyber}
                            onChange={e => handleChange(item.id, "cyber", e.target.value)}
                            className="border rounded px-2 py-1"
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <StatusBadge status={item.cyber as StatusColor} />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {isAdmin ? (
                          <>
                            <select
                              value={edit.procurement ?? item.procurement}
                              onChange={e => handleChange(item.id, "procurement", e.target.value)}
                              className="border rounded px-2 py-1"
                            >
                              {STATUS_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            <button
                              className="ml-2 px-3 py-1 bg-[#e1241b] text-white rounded disabled:opacity-50"
                              onClick={() => handleSave(item.id)}
                              disabled={saving === item.id}
                            >
                              {saving === item.id ? "Saving..." : "Save"}
                            </button>
                          </>
                        ) : (
                          <StatusBadge status={item.procurement as StatusColor} />
                        )}
                      </TableCell>
                      <TableCell>{item.infrastructure}</TableCell>
                      <TableCell>{item.license}</TableCell>
                      <TableCell>
                        {isAdmin ? (
                          <input
                            type="text"
                            className="border rounded px-2 py-1 w-full"
                            value={edit.comments ?? item.comments ?? ""}
                            onChange={e => handleChange(item.id, "comments", e.target.value)}
                            placeholder={"If approved, comment 'Accepted'; else, state the rejection reason."}
                          />
                        ) : (
                          item.comments || ""
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
