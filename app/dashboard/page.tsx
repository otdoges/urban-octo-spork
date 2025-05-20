"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Plus, ExternalLink, Edit, Trash2 } from "lucide-react"
import { useWebsites } from "@/lib/hooks/use-convex"
import { useUser } from "@clerk/nextjs"
import { Id } from "@/convex/_generated/dataModel"

// Define WebsiteType interface for type safety
interface WebsiteType {
  _id: Id<"websites">
  name: string
  url: string
  status: string
  createdAt: number
  userId: string
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("all")
  const { websites, updateWebsiteStatus } = useWebsites()
  const { isLoaded: isUserLoaded } = useUser()
  
  const isLoading = !isUserLoaded || websites === undefined

  const handleDeleteSite = async (id: Id<"websites">) => {
    try {
      // Set status to "deleted" instead of actually deleting
      await updateWebsiteStatus({ websiteId: id, status: "deleted" })
    } catch (error) {
      console.error("Error deleting website:", error)
    }
  }

  const filteredSites =
    activeTab === "all"
      ? websites?.filter((site: WebsiteType) => site.status !== "deleted") || []
      : websites?.filter((site: WebsiteType) => 
          site.status === activeTab && site.status !== "deleted"
        ) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Sites</h1>
        <Button asChild>
          <Link href="/">
            <Plus className="mr-2 h-4 w-4" />
            New Site
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Sites</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredSites.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/20">
              <h3 className="text-lg font-medium mb-2">No sites found</h3>
              <p className="text-muted-foreground mb-4">
                {activeTab === "all" ? "You haven't created any sites yet." : `You don't have any ${activeTab} sites.`}
              </p>
              <Button asChild>
                <Link href="/">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Site
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredSites.map((site: WebsiteType) => (
                <Card key={site._id}>
                  <CardHeader>
                    <CardTitle>{site.name}</CardTitle>
                    <CardDescription>Created {new Date(site.createdAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      <p>Source: {site.url}</p>
                      <p className="mt-1">
                        Status:{" "}
                        <span
                          className={`font-medium ${site.status === "completed" ? "text-green-600" : site.status === "processing" ? "text-blue-600" : site.status === "failed" ? "text-red-600" : "text-amber-600"}`}
                        >
                          {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" asChild>
                      <Link href={`/results?websiteId=${site._id}&url=${encodeURIComponent(site.url)}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteSite(site._id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
