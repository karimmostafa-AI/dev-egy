import { useState } from "react";
import { 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  MoreHorizontal
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  useBlogPosts, 
  useDeleteBlogPost,
  useUpdateBlogPost
} from "@/hooks/admin/useAdminHooks";

const statusColors = {
  published: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-blue-100 text-blue-800",
};

export default function BlogPostManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { toast } = useToast();

  // Fetch blog posts
  const { 
    data: blogPostsResponse, 
    isLoading, 
    error,
    refetch 
  } = useBlogPosts({ page, limit });

  // Mutations
  const deletePostMutation = useDeleteBlogPost();
  const updatePostMutation = useUpdateBlogPost();

  // Extract blog posts from response
  const blogPosts = blogPostsResponse?.success ? blogPostsResponse.data?.data || [] : [];
  const pagination = blogPostsResponse?.success ? blogPostsResponse.data?.pagination : null;

  // Filter posts based on search term
  const filteredPosts = blogPosts.filter((post: any) => 
    post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (isPublished: boolean, isFeatured: boolean) => {
    const status = isPublished ? "published" : "draft";
    const displayText = isPublished ? "Published" : "Draft";
    
    return (
      <div className="flex items-center gap-2">
        <Badge className={statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
          {displayText}
        </Badge>
        {isFeatured && (
          <Badge variant="secondary" className="text-xs">Featured</Badge>
        )}
      </div>
    );
  };

  const handleDeletePost = async (postId: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        const result = await deletePostMutation.mutateAsync(postId);
        if (result.success) {
          toast({
            title: "Success",
            description: "Blog post deleted successfully",
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete blog post",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete blog post",
          variant: "destructive",
        });
      }
    }
  };

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    try {
      const result = await updatePostMutation.mutateAsync({
        blogPostId: postId,
        data: { isPublished: !currentStatus }
      });
      if (result.success) {
        toast({
          title: "Success",
          description: `Blog post ${!currentStatus ? 'published' : 'unpublished'} successfully`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update blog post",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | number) => {
    if (!dateString) return "Not set";
    const date = typeof dateString === 'number' ? new Date(dateString * 1000) : new Date(dateString);
    return date.toLocaleDateString();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
            <p className="mt-2 text-red-600">
              Error loading blog posts. Please try again.
            </p>
          </div>
          <Button onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

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
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Updated Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading skeleton
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="max-w-xs">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredPosts.length > 0 ? (
                filteredPosts.map((post: any) => (
                  <TableRow key={post.id} data-testid={`row-post-${post.id}`}>
                    <TableCell className="max-w-xs">
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900">
                          {post.title}
                        </div>
                        {post.excerpt && (
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {post.excerpt}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(post.isPublished, post.isFeatured)}
                    </TableCell>
                    <TableCell className="text-gray-900">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {formatDate(post.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-900">
                      {formatDate(post.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="h-8 w-8 p-0" 
                            data-testid={`button-actions-${post.id}`}
                            disabled={deletePostMutation.isPending || updatePostMutation.isPending}
                          >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
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
                          <DropdownMenuItem 
                            onClick={() => handleTogglePublish(post.id, post.isPublished)}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {post.isPublished ? 'Unpublish' : 'Publish'}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeletePost(post.id, post.title)}
                          >
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
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm ? "No blog posts found matching your search" : "No blog posts found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={!pagination.hasPrev || isLoading}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={!pagination.hasNext || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}