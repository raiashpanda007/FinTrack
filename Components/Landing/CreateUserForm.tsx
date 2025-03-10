import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
interface CreateUserFormProps {
  name: string;
  email: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}
function CreateUserForm({
  name,
  email,
  setName,
  setEmail,
}: CreateUserFormProps) {
  return (
    <form className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-1">
      <Label htmlFor="email">Email</Label>
        <Input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
      </div>
    </form>
  );
}

export default CreateUserForm;
