import  React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useState } from "react"
import { useDebounceValue } from 'usehooks-ts'


import * as z from "zod"

const page = () => {

  const [ username , setUsername ] = useState('')
  const [ usernameMessage , setUsernameMessage] = useState('')
  const [ isCheckingUsername , setIsCheckUsername] = useState(false)
  const [ isSubmitting , setIsSubmitting] = useState(false)
   const [debouncedValue, setValue] = useDebounceValue(username, 500)
  
  return (
    <div>page</div>
  )
}

export default page