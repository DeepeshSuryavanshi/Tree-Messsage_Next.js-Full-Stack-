'use client'
import { ApiResponse } from '@/Types/ApiResponse';
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Description } from '@radix-ui/react-toast';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '@/components/Navbar';


function Page(){
    const [message,setMessage] = useState<Message[]>([]);
    const [isLoading,setIsLoading] = useState(false);
    const [isSwitchLoading,setIsSwitchLoading] = useState(false);
    const {toast} = useToast()

    const handleDeleteMessage=(messageId:string)=>{
        setMessage(message.filter((message)=> message._id! == messageId))
       }

    // session 
    const {data:session} = useSession()
    // form 
    const form = useForm({
        resolver:zodResolver(acceptMessageSchema)
    })

    const {register,watch,setValue} = form;
    const acceptMessages = watch('Accept Messages')

    const featchAcceptMessages = useCallback( async ()=>{
        try {
           const response = await axios.get<ApiResponse>('/api/accept-message');
           setValue("Accept Messages",response.data.isAcceptingMessage)
           setIsSwitchLoading(response.data.isAcceptingMessage)
        } catch (error) {
            var AxiosError = error as  AxiosError<ApiResponse>;
            toast(
                {
                title:'Error',
                description:AxiosError.response?.data.message ||'Failed to faetch messsage setting',
                variant:'destructive'
            })
        }finally{
            setIsSwitchLoading(false)
        }
    },[setValue,toast])

   
const featchMessages = useCallback(async (refresh:boolean = false)=>{
      // console.log('featchMessages');
        setIsLoading(true)
        setIsSwitchLoading(false)
        try {
          const response = await axios.get<ApiResponse>('/api/get-message');
            setMessage(response.data.messages || [])
            setIsLoading(false)
            if (refresh) {
                toast({
                    title:'Refresh Messages',
                    description:'Showing latet messsages'
                })
            }
         } catch (error) {
             var AxiosError = error as  AxiosError<ApiResponse>;
             toast(
                 {
                 title:'Messages',
                 description:AxiosError.response?.data.message ||'Failed to faetch messsage setting',
                 variant:'destructive'
             })
         }finally{
             setIsSwitchLoading(false)
         }
    },[setIsLoading,setMessage,toast])

 //  useeffect setup
    useEffect(()=>{
        if(!session || !session.user)return ;
        featchMessages();
        featchAcceptMessages()
    },[setValue,session,featchAcceptMessages,toast,featchMessages])

    // handle switch change
    const handleSwitchChange = async () =>{
        try {
            const response = await axios.post<ApiResponse>('/api/accept-message',{acceptMessages:!acceptMessages});
            setValue("Accept Messages",!acceptMessages)
            toast({
                title:response.data.message
            })
        } catch (error) {
            var AxiosError = error as  AxiosError<ApiResponse>;
             toast(
                 {
                 title:'Error',
                 description:AxiosError.response?.data.message ||'Failed to Switch messsage setting',
                 variant:'destructive'
             })
        }
    }

    //Tod: Do more reserch 
    const  username  = session?.user.username as User;
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () =>{
        navigator.clipboard.writeText(profileUrl)
        toast({
            title:'URL Copied',
            description:"Profile URL had Been Codied to ClipBoard"
        })
    }
    // login condition 
    if(!session || !session.user) { return <div className=' text-center font-bold items-center text-4xl'>Please Login First</div> }
    
    return (
      <>
      <Navbar/>
            <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
              <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                  <input
                    type="text"
                    value={profileUrl}
                    disabled
                    className="input input-bordered w-full p-2 mr-2"
                  />
                  <Button onClick={copyToClipboard}>Copy</Button>
                </div>
              </div>
        
              <div className="mb-4">
                <Switch
                  {...register('acceptMessages')}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                />
                <span className="ml-2">
                  Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
              </div>
              <Separator />
        
              <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  featchMessages(true);
                }}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
              </Button>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {message.length > 0 ? (
                  message.map((message, index) => (
                    <MessageCard
                      key={message._id}
                      message={message}
                      onMessageDelete={handleDeleteMessage}
                    />
                  ))
                ) : (
                  <p>No messages to display.</p>
                )}
              </div>
            </div>
            </>
          );
}
export default Page;