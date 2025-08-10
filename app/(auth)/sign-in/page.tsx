import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import SignInForm from '@/components/shared/auth/sign-in-form'
import { auth } from '@/auth'

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your account"
}

const SignInPage = async (props: {searchParams: Promise<{callbackUrl: string}>}) => {
  const { callbackUrl } = await props.searchParams;
  // Replace the selection with:
  const session = await auth();

  if (session) {
    redirect(callbackUrl || '/');
  }

  return (
    <div className='w-full max-w-md mx-auto'>
        <Card>
            <CardHeader className='space-y-4'>
                <Link href="/" className='flex-center'>
                    <Image src="/images/logo.svg" alt="Logo" width={100} height={100} priority={true}/>
                </Link>
                <CardTitle className='text-center'>Sign In</CardTitle>
                <CardDescription className='text-center'>Sign In to Your account</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
                <SignInForm />
            </CardContent>
        </Card>
    </div>
  )
}

export default SignInPage
