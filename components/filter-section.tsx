"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface FilterSectionProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  categoryFilter: string
  setCategoryFilter: (category: string) => void
  categories: string[]
  rightAction?: React.ReactNode
}

export function FilterSection({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  categories,
  rightAction,
}: FilterSectionProps) {
  return (
    <Card className="border-[#e1241b] shadow-md">
      <CardHeader className="bg-[#e1241b]">
        <CardTitle className="text-white">Filters</CardTitle>
        <CardDescription className="text-red-100">Search and filter AI models</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search by model or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-[#e1241b] focus-visible:ring-[#e1241b]"
            />
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-[#e1241b] focus:ring-[#e1241b]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {rightAction && (
            <div className="w-full sm:w-auto flex justify-end">{rightAction}</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}