"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createUserColumns } from "./columns";
import { DataTable } from "./data-table";
import { deleteUser, fetchUsers } from "./api";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserResponse } from "./types";
import { DeleteConfirmationDialog } from "./DeleteDialog";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";
import { NotFoundComponet } from "@/components/NotFound";

const GENDERS = ["male", "female"];
const STATUSES = ["active", "inactive"];

export default function UsersPage() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [filter, setFilter] = useState<string>("");
  const debouncedFilter = useDebounce(filter, 1000);
  const [gender, setGender] = useState<string>("");
  const [active, setActive] = useState<string>("");

  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["users", debouncedFilter, active, gender],
    queryFn: ({ pageParam = 1 }) =>
      fetchUsers(pageParam, 20, debouncedFilter, active, gender),
    getNextPageParam: (lastPage) => lastPage.next,
    initialPageParam: 1,
  });

  const deleteUserMutation = useMutation({
    mutationFn: () => deleteUser(selectedUser!.id.toString()),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users", debouncedFilter, active, gender],
      });
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      console.error("Error deleting user:", error);
    },
  });

  const flatData = useMemo(
    () => data?.pages?.flatMap((page) => page.data) ?? [],
    [data]
  );

  const columns = createUserColumns({
    onView: (user: UserResponse) => {
      router.push(`/users/${user.id}?mode=view`);
    },
    onEdit: (user: UserResponse) => {
      router.push(`/users/${user.id}?mode=edit`);
    },
    onDelete: (user: UserResponse) => {
      setSelectedUser(user);

      setDeleteDialogOpen(true);
    },
  });

  const handleDelete = () => {
    toast.promise(deleteUserMutation.mutateAsync(), {
      loading: "Deleting user...",
      success: "User deleted successfully!",
      error: "Error deleting user.",
    });
  };

  if (isError) {
    return <NotFoundComponet />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>

        <div className="flex justify-between items-center gap-4 my-4">
          <div className="flex gap-4">
            {/* Email Filter */}
            <Input
              placeholder="Filter emails..."
              value={filter ?? ""}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-xs grow"
            />

            {/* Gender Single-Select */}
            <Select
              onValueChange={(value) => {
                setGender(value || "");
              }}
              value={gender}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Gender" />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Status Single-Select */}
            <Select
              onValueChange={(value) => {
                setActive(value || "");
              }}
              value={active}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={() => {
                setGender("");
                setActive("");
                setFilter("");
              }}
            >
              Clear Filters
            </Button>
          </div>

          <Button onClick={() => router.push("users/new")}>Create User</Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={flatData}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isLoading={isLoading}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        user={selectedUser?.name}
      />
    </div>
  );
}
