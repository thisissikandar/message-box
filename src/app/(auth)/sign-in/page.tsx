"use client"
<<<<<<< HEAD
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
=======
import React from 'react'

const page = () => {
  return (
    <div>Signin</div>
  )
}

export default page
>>>>>>> f8426a92c2ab48cf9ad1ac466f9c367d09268626
