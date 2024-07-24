'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as  z  from "zod"
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { singInSchema } from "@/schemas/signInSchema";
import { signIn } from 'next-auth/react';


//main
 const Page=()=>{
    const [isSubmiting,setIsSubmiting] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

// zod implimentation
const form = useForm<z.infer <typeof singInSchema>>({
    resolver:zodResolver(singInSchema),
    defaultValues:{
        identifier:"",
        password:""
    }
})

     const onSubmit = async (data:z.infer<typeof singInSchema>)=>{
     setIsSubmiting(true)
      var result = await signIn('credentials',{
        redirect:false,
        identifier:data.identifier,
        password:data.password
      })
      if(result?.error){
          
        if (result.error == "CredentialsSignin") {
            setIsSubmiting(false)
            toast({
            title:"Failed signIn",
            description:"Incorrect Email or password",
            variant:"destructive"
            })
          }else{
            toast({
              title:"error",
              description:result.error,
              variant:"destructive"
            })
          }

          setIsSubmiting(false)
        }

        if(result?.url){
          setIsSubmiting(false)
          router.replace('/dashboard')
        }

     }

    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-700">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6" >
                    Sign-in True Message</h1>
                <p className="mb-4">Sign-In to start your anonymouse adventure</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-6">
                <FormField
                   name="identifier"
                   control={form.control}
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Username / Email</FormLabel>
                       <FormControl>
                        <Input placeholder="Email / username" {...field} />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                   name="password"
                   control={form.control}
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Password</FormLabel>
                       <FormControl>
                        <Input placeholder="password" {...field}  />
                       </FormControl>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <Button type="submit" disabled={isSubmiting} >
                   {
                    isSubmiting ? (<> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait </>) : ('Sign-in')
                   }
                 </Button>
        </form>
            </Form>
            <div className="text-center mt-4 ">
              <p>Be a member?{' '}</p>
              <Link href="/sign-up" className="text-blue-600 hover:text-blue-800"  >Sign-up</Link>
            </div>
          </div>
        </div>
    )
}

export default Page