"use client"

import { useState, useEffect } from "react"
import { FilterSection } from "@/components/filter-section"
import { ModelTable, type ModelData } from "@/components/model-table"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { NewModelForm } from "@/components/NewModelForm"

export default function ModelStatusDashboard() {
  const [data, setData] = useState<ModelData[]>([])
  const [filteredData, setFilteredData] = useState<ModelData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/models")
      const dbData = await res.json()
      setData(dbData)
      setFilteredData(dbData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    let filtered = data

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter)
    }

    setFilteredData(filtered)
  }, [searchTerm, categoryFilter, data])

  const categories = Array.from(new Set(data.map((item) => item.category)))

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-800">Loading AI model data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div
          className="relative w-full h-80 flex flex-col justify-center pl-12 mb-6"
          style={{
            backgroundImage: 'url(/Homepage_Hero-Background.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-white z-10 drop-shadow-lg text-left">
            Approved Models
          </h1>
          <p className="text-sm text-white z-10 mt-1 text-left">
          Explore our carefully reviewed and approved models, guaranteed to meet quality and performance standards for your projects.
          </p>
        </div>

        <div className="container mx-auto p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <FilterSection
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categories={categories}
                rightAction={
                  <NewModelForm onModelAdded={fetchData} />
                }
              />
            </div>
          </div>
          <ModelTable 
            filteredData={filteredData} 
            totalCount={data.length} 
            onUpdate={fetchData}
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
