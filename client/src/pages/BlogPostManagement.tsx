import { useState } from "react";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock data for blog posts
const blogPostsData = [
  {
    id: 1,
    title: "The Ultimate Guide to Choosing Medical Scrubs",
    excerpt: "Learn everything you need to know about selecting the perfect scrubs for your medical profession.",
    author: {
      name: "Dr. Sarah Johnson",
      avatar: "",
    },
    status: "published",
    publishDate: "2023-05-15",
    views: 1250,
    comments: 23,
    featured: true,
  },
  {
    id: 2,
    title: "Infection Control Best Practices in Healthcare",
    excerpt: "Essential guidelines for maintaining proper hygiene and infection control in medical settings.",
    author: {
      name: "Nurse Patricia Wilson",
      avatar: "",
    },
    status: "published",
    publishDate: "2023-05-10",
    views: 890,
    comments: 15,
    featured: false,
  },
  {
    id: 3,
    title: "Comfort and Style: New Lab Coat Collection",
    excerpt: "Discover our latest collection of lab coats designed for both comfort and professional appearance.",
    author: {
      name: "Admin Team",
      avatar: "",
    },
    status: "draft",
    publishDate: "",
    views: 0,
    comments: 0,
    featured: false,
  },
  {
    id: 4,
    title: "Healthcare Worker Wellness Tips",
    excerpt: "Important self-care tips for healthcare professionals working long hours.",
    author: {
      name: "Dr. Michael Chen",
      avatar: "",
    },
    status: "scheduled",
    publishDate: "2023-05-25",
    views: 0,
    comments: 0,
    featured: true,
  },
  {
    id: 5,
    title: "Understanding Different Types of Medical Footwear",
    excerpt: "A comprehensive guide to choosing the right shoes for your medical work environment.",
    author: {
      name: "Nurse Emily Rodriguez",
      avatar: "",
    },
    status: "published",
    publishDate: "2023-05-08",
    views: 654,
    comments: 8,
    featured: false,
  },
];

const statusColors = {
  published: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-blue-100 text-blue-800",
};

export default function BlogPostManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = blogPostsData.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const displayText = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
        {displayText}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
          <p className="mt-2 text-gray-700">
            Manage your blog posts and content.
          </p>
        </div>
        <Button data-testid="button-add-post">
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <label htmlFor="search-posts" className="sr-only">
            Search blog posts
          </label>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" aria-hidden="true" />
          <Input
            id="search-posts"
            placeholder="Search blog posts..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="input-search-posts"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Comments</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                    <TableCell className="max-w-xs">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {post.title}
                          {post.featured && (
                            <Badge variant="secondary" className="text-xs">Featured</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {post.excerpt}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback className="text-xs">
                            {post.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-900">{post.author.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(post.status)}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {post.publishDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {new Date(post.publishDate).toLocaleDateString()}
                        </div>
                      ) : (
                        <span className="text-gray-500">Not scheduled</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {post.views.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {post.comments}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0" data-testid={`button-actions-${post.id}`}>
                            <span className="sr-only">Open menu</span>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Post
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Post
                          </DropdownMenuItem>
                          {post.status === "draft" && (
                            <DropdownMenuItem>
                              <Calendar className="mr-2 h-4 w-4" />
                              Schedule
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No blog posts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}