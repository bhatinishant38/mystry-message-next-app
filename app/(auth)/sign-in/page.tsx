import  React, { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "@/components/ui/toast"
import  axios ,{AxiosError}  from "axios"

import * as z from "zod"
import { useRouter } from "next/router"
import { SignUpSchema } from "@/Schemas/signUpSchema"
import { ApiResponse } from "@/types/ApiResponse"

const page = () => {

  const [ username , setUsername ] = useState('')
  const [ usernameMessage , setUsernameMessage ] = useState('')
  const [ isCheckingUsername , setIsCheckingUsername ] = useState(false)
  const [ isSubmitting , setIsSubmitting ] = useState(false)
  const debouncedUsername = useDebounceValue(username, 500)
  const router = useRouter()

  // zod implementation

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver : zodResolver(SignUpSchema),
    defaultValues : {
      username : "",
      email : "",
      password : ""
    }

   
  })
  useEffect(()=>{
    const checkUsernameUnique = async ()=>{
      if(debouncedUsername){
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {
         const response = await axios.get(`/api/check-username-unique?username:${debouncedUsername}`)
          setUsernameMessage(response.data.message)
          
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>
          axiosError.response?.data.message ?? "Error checking username"
          
        } finally{
          setIsCheckingUsername(false)
        }
      }
    }
    checkUsernameUnique()
  },[debouncedUsername])

  return (
    <div>page</div>
  )
}

export default page