"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";
import { createUser } from "../api";
import { DatePicker } from "@/components/ui/date-picker";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserForm } from "../UserForm";

export default function UserCreationPage() {
  const router = useRouter();
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

  // React Query mutation
  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      console.log("User created successfully:", data);
      toast.success("User created successfully!");
      router.push("/users");
    },
    onError: (error: any) => {
      console.error("Error creating user:", error);
      const errorMessage =
        error.response?.data?.detail ||
        "Failed to create user. Please try again.";
      toast.error(errorMessage);
    },
  });

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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    createUserMutation.mutate(formData);
  };

  const handleReset = () => {
    setFormData({
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
    setErrors({});
    createUserMutation.reset();
    toast.info("Form reset", {
      description: "All fields have been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.history.back()}
            className="h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-semibold">Create New User</h1>
        </div>

        {/* User Form */}
        <UserForm
          formData={formData}
          errors={errors}
          isEditMode={true}
          onInputChange={handleInputChange}
          showMetadata={true}
        />

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleSubmit}
            disabled={createUserMutation.isPending}
            className="flex-1"
          >
            {createUserMutation.isPending ? "Creating User..." : "Create User"}
          </Button>
          <Button variant="outline" onClick={handleReset} className="px-8">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
