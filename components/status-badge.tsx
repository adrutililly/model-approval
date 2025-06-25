import { Badge } from "@/components/ui/badge"

export type StatusColor = "green" | "yellow" | "orange" | "red" | "rejected" | "submitted" | "in review" | "depreciated"

export const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "green":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
    case "yellow":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200"
    case "orange":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200"
    case "red":
      return "bg-red-100 text-red-800 hover:bg-red-200"
    case "rejected":
      return "bg-[#f8d7da] text-[#a94442] hover:bg-[#f2bcbc]" // much lighter reddish brown
    case "submitted":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    case "in review":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    case "depreciated":
      return "bg-zinc-200 text-zinc-700 hover:bg-zinc-300" // much lighter dark grey
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200"
  }
}

export const StatusBadge = ({ status }: { status: string }) => (
  <Badge variant="secondary" className={getStatusBadgeVariant(status)}>
    {status}
  </Badge>
)
