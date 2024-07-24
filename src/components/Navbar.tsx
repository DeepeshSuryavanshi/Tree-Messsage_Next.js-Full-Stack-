'use client'
import React from 'react';
import Link from 'next/link';
import { useSession,signOut } from 'next-auth/react';
import {User} from 'next-auth'
import { Button } from "@/components/ui/button";


function Navbar(){
    const {data:session} = useSession();
    const user:User = session?.user

    return(
        <nav className='p-4 md:p-6 h-auto shadow-md bg-gray-800 text-white'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a href="#" className='text-2xl font-semibold mb-4 md:mb-0 '> Mystory message</a>
                {
                    session ? ( 
                        <>
                         <span className='mr-4'>Welcome, {user.username || user.email }</span>
                         <Button className='w-full md:w-auto m-5 text-black' onClick={()=>signOut()} variant={'outline'}>LogOut</Button>
                         </>
                    ):(
                        <Link href='/sign-in'>
                        <Button className='w-full md:w-auto m-5 text-black' variant={'outline'} >LogIn</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}
export default Navbar;