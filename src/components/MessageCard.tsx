"use client";
import React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
import { useToast } from "./ui/use-toast";
import axios from "axios";
import { ApiResponse } from "@/Types/ApiResponse";
import dayjs from 'dayjs';
import { date } from "zod";

type MessageCardProps = {
    message:Message;
    onMessageDelete: (messageId:string) => void
}


const MessageCard = ({message,onMessageDelete}:MessageCardProps) => {
    const {toast} = useToast()
    var M = message
    const handleDeleteConform = async ( ) =>{
        var responce =  await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
        toast({
            title:responce.data.message
        })
    }

    return (
        <>
        <Card className="flex items-center p-4">
            <div className="w-2/3">
            <CardContent>
                    <p className="text-2xl font-semibold">{message.content}</p>
            </CardContent>
            <CardFooter>
            {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
            </CardFooter>
            </div>
            <div className="w-1/3">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='destructive'><X className="w-5 h-5" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                Message.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConform}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </Card>
        </>
    );
}
export default MessageCard;
