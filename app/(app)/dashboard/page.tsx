'use client'

import { toast } from '@/components/ui/toast'
import { Message } from '@/models/User'
import { AcceptMessageSchema } from '@/Schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const Dashboard = () => {

  const [messages ,setMessages] = useState<Message[]>([])
  const [isLoading ,setIsLoading] = useState(false)
  const [isSwitchLoading ,setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId : string) =>{
    setMessages(messages.filter((message)=> message._id !== messageId))
  }

  const {data :session} = useSession()

  const form = useForm({
    resolver : zodResolver(AcceptMessageSchema)
  })

  const {register , watch ,setValue} = form

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback( async ()=>{
    setIsSwitchLoading(true)
    try {
     const response = await axios.get<ApiResponse>('/api/accept-messages')
     setValue('acceptMessages',response.data.isAcceptingMessage)
      
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      toast.add({
        title : "Error",
        description : axiosError.response?.data.message || "failed to fetch message settings"

      })
      
    } finally{
      setIsSwitchLoading(false)
    }

  } ,[setValue])

  const fetchMessages = useCallback(async (refresh : boolean = false)=>{
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get<ApiResponse>('/api/get-messages')
      setMessages(response.data.messages || [])
      if(refresh){
        toast.add({
          title : "Refreshed Messages",
          description : "Showing latest messages"
        })
      }   
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        toast.add({
          title : "Error",
          description : axiosError.response?.data.message || "failed to fetch message settings"

        })     
    } finally{
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  },[setIsLoading ,setMessages])

  useEffect(()=>{

  },[session ,setValue ,fetchAcceptMessage ,fetchMessages])
  
  return (
    <div>Dashboard page
      
    </div>
  )
}

export default Dashboard