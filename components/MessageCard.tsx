'use client'

import React from 'react'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
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
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import type { Message } from '@/models/User'
import { toast } from './ui/toast'
import { ApiResponse } from '@/types/ApiResponse'
import axios from 'axios'

type MessageCardProps = {
    message : Message ;
    onMessageDelete : (messageId : string)=> void
}

const MessageCard = ({message ,onMessageDelete}:MessageCardProps) => {
  

  const handleDeleteConfirm = async ()=>{
    const response = axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
    toast.add({
        title : (await response).data.message
    })
    onMessageDelete(message._id)  
  }

  return (
    <Card className='h-full'>
        <CardHeader className='grid-cols-[1fr_auto]'>
            <CardTitle className='text-base font-semibold'>Anonymous message</CardTitle>
            <CardDescription>
                {new Date(message.createdAt).toLocaleString()}
            </CardDescription>
            <CardAction>
            <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              variant='destructive'
              size='icon'
              aria-label='Delete message'
             
            >
              <X aria-hidden='true' />
            </Button>
          }
        />
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This message will be permanently deleted.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              
              variant='destructive'
            >
              Delete message
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
            </CardAction>
        </CardHeader>
        <CardContent className='whitespace-pre-wrap break-words leading-relaxed'>
            {message.content}
        </CardContent>
   </Card>
  )
}

export default MessageCard