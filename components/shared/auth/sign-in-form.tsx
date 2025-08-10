"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInDefaultValues } from "@/lib/constants";
import { signInWithCredentials } from "@/lib/actions/user.action";

const SignInForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { pending } = useFormStatus();
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });


  return (
    <form action={action}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            defaultValue={signInDefaultValues.password}
          />
        </div>
        <div>
          <Button type="submit" className="w-full cursor-pointer" variant={"default"} disabled={pending}>
            {pending ? "Signing In..." : "Sign In"}
          </Button>
        </div>
        {data && !data.success && (
          <p className="text-sm text-center text-red-500">{data.message}</p>
        )}
        <p className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" target="_self" className="link">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
};

export default SignInForm;
