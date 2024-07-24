'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as  z  from "zod"
import Link from "next/link";
import { Loader2 } from "lucide-react";
import axios,{AxiosError} from 'axios'
import { useToast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { useDebounceValue , useDebounceCallback } from 'usehooks-ts';
import { signeUpSchema } from "@/schemas/signUpSchema"
import { ApiResponse } from "@/Types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

//main
 const Page=()=>{
    const [username,setUsername] = useState('');
    const [usernameMesage,setusernameMesage] = useState('');
    const [isCheckingUsername,setIsCheckingUsername] = useState(false);
    const [isSubmiting,setIsSubmiting] = useState(false)
    
    const debounce = useDebounceCallback(setUsername,500);
    const { toast } = useToast()
    const router = useRouter()

// zod implimentation
const form = useForm<z.infer <typeof signeUpSchema>>({
    resolver:zodResolver(signeUpSchema),
    defaultValues:{
        username:"",
        email:"",
        password:""
    }
})

useEffect(()=>{
const checkUsernameUnique = async () => {
    if(username){
        setIsCheckingUsername(true);
        setusernameMesage('')
        try {
          const responce = await axios.get(`/api/check-username-unique?username=${username}`)
          console.log(responce.data);
          setusernameMesage(responce.data.message)
        } catch (error) {
     console.log(error);
          const axioError = error as AxiosError <ApiResponse>
            setusernameMesage(
                axioError.response?.data.message ?? "Error Checking UserName !"
            )
        }finally{
            setIsCheckingUsername(false)
        }
    }
} 
checkUsernameUnique();
},[username])

     const onSubmit = async (data:z.infer<typeof signeUpSchema>)=>{
     setIsSubmiting(true)
   
     try {
        var response = await axios.post<ApiResponse>(`/api/sign-up`,data) 
        toast({
            title:'sucess',
            description:response.data.message
        }) 
        router.replace(`/verify/${username}`)
        setIsSubmiting(false)
         } catch (error) {
          console.error("error is signing up of User ",error);
          
        const axioError = error as AxiosError <ApiResponse>
        let errorMessage = axioError.response?.data.message
        toast({
            title:"Signup failed",
            description:errorMessage,
            variant:"destructive"
        })
        setIsSubmiting(false)
       }
     }
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-700">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6" >
                    Join True Message</h1>
                <p className="mb-4">Sign up to start your anonymouse adventure</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-6">
                <FormField
                   name="username"
                   control={form.control}
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Username</FormLabel>
                       <FormControl>
                        <Input placeholder="Username" {...field} 
                        onChange={(e)=>{
                          field.onChange(e); debounce(e.target.value)
                        }} />
                       </FormControl>
                       {isCheckingUsername && <Loader2 className="animate-spin"/>}
                       <p className={`text-sm ${usernameMesage === "username is unique" ? 'text-green-600':'text-red-500'}`}>{usernameMesage}</p>
                       <FormDescription>
                         This is your public display Username.
                       </FormDescription>
                       <FormMessage />
                     </FormItem>
                   )}
                 />
                 <FormField
                   name="email"
                   control={form.control}
                   render={({ field }) => (
                     <FormItem>
                       <FormLabel>Email</FormLabel>
                       <FormControl>
                        <Input placeholder="email" {...field} />
                       </FormControl>
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
                    isSubmiting ? (<> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait </>) : ('Sign-up')
                   }
                 </Button>
        </form>
            </Form>
            <div className="text-center mt-4 ">
              <p>Already a member?{' '}</p>
              <Link href="/sign-in" className="text-blue-600 hover:text-blue-800" >Sign-in </Link>
            </div>
          </div>
        </div>
    )
}

export default Page