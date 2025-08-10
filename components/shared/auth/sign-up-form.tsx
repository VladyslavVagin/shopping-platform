"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";
import { signUpUser } from "@/lib/actions/user.action";

const SignUpForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { pending } = useFormStatus();
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });


  return (
    <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
          <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            name="name"
            required
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            required
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>
        <div>
          <Button type="submit" className="w-full cursor-pointer" variant={"default"} disabled={pending}>
            {pending ? "Signing Up..." : "Sign Up"}
          </Button>
        </div>
        {data && !data.success && (
          <p className="text-sm text-center text-red-500">{data.message}</p>
        )}
        <p className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" target="_self" className="link">
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignUpForm;