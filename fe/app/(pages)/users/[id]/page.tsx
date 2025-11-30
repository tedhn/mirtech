"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Save, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchUserById, updateUser } from "../api";
import { UserForm } from "@/app/(pages)/users/UserForm";
import { LoadingComponent } from "@/components/loading";

export default function UserDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const queryClient = useQueryClient();
  const mode = searchParams.get("mode") || "view";

  const [isEditMode, setIsEditMode] = useState(mode === "edit");

  const userId = params.id as string;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip_code: "",
    country: "",
    date_of_birth: "",
    gender: "",
    is_active: true,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch user data
  const { data: user, isLoading } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserById(userId),
    enabled: !!userId,
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: (data: any) => updateUser(userId, data),
    onSuccess: () => {
      toast.success("User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["user", params.id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      router.push(`/users/${params.id}?mode=view`);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.detail || "Failed to update user.";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    setIsEditMode(mode === "edit");
  }, [mode]);

  // Populate form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address?.address || "",
        city: user.address?.city || "",
        zip_code: user.address?.zip_code || "",
        country: user.address?.country || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || "",
        is_active: user.is_active ?? true,
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.zip_code.trim()) newErrors.zip_code = "Zip code is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.date_of_birth)
      newErrors.date_of_birth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    updateUserMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address?.address || "",
        city: user.address?.city || "",
        zip_code: user.address?.zip_code || "",
        country: user.address?.country || "",
        date_of_birth: user.date_of_birth || "",
        gender: user.gender || "",
        is_active: user.is_active ?? true,
      });
    }
    setErrors({});
    router.push(`/users/${params.id}?mode=view`);
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/users")}
              className="h-10 w-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold">
                {isEditMode ? "Edit User" : "User Details"}
              </h1>
              {user && (
                <p className="text-sm text-muted-foreground">ID: {user.id}</p>
              )}
            </div>
          </div>

          {!isEditMode ? (
            <Button
              onClick={() => router.push(`/users/${params.id}?mode=edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={updateUserMutation.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {updateUserMutation.isPending ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* User Form */}
        <UserForm
          formData={formData}
          errors={errors}
          isEditMode={isEditMode}
          onInputChange={handleInputChange}
          showMetadata={true}
          metadata={{
            created_at: user?.created_at,
            last_login: user?.last_login,
          }}
        />
      </div>
    </div>
  );
}
