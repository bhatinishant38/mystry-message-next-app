'use client'

import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { Button } from 'react-email'
import { X } from 'lucide-react'
import { Message } from 'react-hook-form'
import { toast } from './ui/toast'
import { ApiResponse } from '@/types/ApiResponse'
import axios from 'axios'

type MessageCardProps = {
    message : Message ;
    onMessageDelete : (messageId : string)=> void
}

const MessageCard = ({message ,onMessageDelete}:MessageCardProps) => {

  const handleDeleteConfirm = async ()=>{
    const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
    toast.add({
        title : response.data.message
    })
    onMessageDelete(message._id)
  }

  return (
   
    <Card>
        <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive"> <X className='w-5 h-5'/> </Button>} />
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account from our servers.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
           
        </CardContent>
      
   </Card>
  )
}

export default MessageCard