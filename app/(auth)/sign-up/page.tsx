import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { auth } from '@/auth'
import SignUpForm from '@/components/shared/auth/sign-up-form'

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Sign up for a new account"
}

const SignUpPage = async (props: {searchParams: Promise<{callbackUrl: string}>}) => {
  const { callbackUrl } = await props.searchParams;
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
                <CardTitle className='text-center'>Create Account</CardTitle>
                <CardDescription className='text-center'>Sign up for a new account</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
               <SignUpForm />
            </CardContent>
        </Card>
    </div>
  )
}

export default SignUpPage