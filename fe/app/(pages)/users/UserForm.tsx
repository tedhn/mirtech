// components/UserForm.tsx
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";

interface UserFormData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zip_code: string;
  country: string;
  date_of_birth: string;
  gender: string;
  is_active: boolean;
}

interface UserFormProps {
  formData: UserFormData;
  errors: { [key: string]: string };
  isEditMode: boolean;
  onInputChange: (field: string, value: string | boolean) => void;
  showMetadata?: boolean;
  metadata?: {
    created_at?: string;
    last_login?: string | null;
  };
}

export function UserForm({
  formData,
  errors,
  isEditMode,
  onInputChange,
  showMetadata = false,
  metadata,
}: UserFormProps) {
  return (
    <div className="space-y-6">
      {/* Personal Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Basic details about the user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => onInputChange("first_name", e.target.value)}
                placeholder="John"
                disabled={!isEditMode}
                className={errors.first_name ? "border-red-500" : ""}
              />
              {errors.first_name && (
                <p className="text-sm text-red-500">{errors.first_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>

              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => onInputChange("last_name", e.target.value)}
                placeholder="Doe"
                className={errors.last_name ? "border-red-500" : ""}
                disabled={!isEditMode}
              />
              {errors.last_name && (
                <p className="text-sm text-red-500">{errors.last_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth</Label>

              <DatePicker
                onClick={(date: Date | undefined) => {
                  if (!date) return;
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  onInputChange("date_of_birth", `${year}-${month}-${day}`);
                }}
                value={
                  formData.date_of_birth
                    ? new Date(formData.date_of_birth)
                    : undefined
                }
                disabled={!isEditMode}
              />
              {errors.date_of_birth && (
                <p className="text-sm text-red-500">{errors.date_of_birth}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>

              <Select
                value={formData.gender.toLowerCase()}
                onValueChange={(value) => onInputChange("gender", value)}
                disabled={!isEditMode}
              >
                <SelectTrigger
                  className={errors.gender ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-sm text-red-500">{errors.gender}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>How to reach the user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onInputChange("email", e.target.value)}
                placeholder="john.doe@example.com"
                disabled={!isEditMode}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => onInputChange("phone", e.target.value)}
                placeholder="+1 (555) 123-4567"
                disabled={!isEditMode}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Address Details
          </CardTitle>
          <CardDescription>User's location information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => onInputChange("address", e.target.value)}
                placeholder="123 Main Street, Apt 4B"
                disabled={!isEditMode}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => onInputChange("city", e.target.value)}
                  placeholder="New York"
                  disabled={!isEditMode}
                  className={errors.city ? "border-red-500" : ""}
                />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip_code">Zip Code</Label>
                <Input
                  id="zip_code"
                  value={formData.zip_code}
                  onChange={(e) => onInputChange("zip_code", e.target.value)}
                  placeholder="10001"
                  disabled={!isEditMode}
                  className={errors.zip_code ? "border-red-500" : ""}
                />
                {errors.zip_code && (
                  <p className="text-sm text-red-500">{errors.zip_code}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>

                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => onInputChange("country", e.target.value)}
                  placeholder="United States"
                  className={errors.country ? "border-red-500" : ""}
                  disabled={!isEditMode}
                />
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>
            {isEditMode
              ? "Set the initial status of the account"
              : "Current status of the account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="is_active" className="text-base">
                Active Account
              </Label>
              <p className="text-sm text-muted-foreground">
                {isEditMode
                  ? "Enable this to activate the user account immediately"
                  : "Current account status"}
              </p>
            </div>
            {isEditMode ? (
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  onInputChange("is_active", checked)
                }
              />
            ) : (
              <Badge variant={formData.is_active ? "default" : "secondary"}>
                {formData.is_active ? "Active" : "Inactive"}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metadata Card (View Mode Only) */}
      {showMetadata && !isEditMode && metadata && (
        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>Additional account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Created At</Label>
                <p className="text-sm py-2">
                  {metadata.created_at
                    ? new Date(metadata.created_at).toLocaleString()
                    : "-"}
                </p>
              </div>
              <div className="space-y-2">
                <Label>Last Login</Label>
                <p className="text-sm py-2">
                  {metadata.last_login
                    ? new Date(metadata.last_login).toLocaleString()
                    : "Never"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
