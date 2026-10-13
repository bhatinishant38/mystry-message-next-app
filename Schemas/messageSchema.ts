import z from "zod";

export const MessagesSchema = z.object({
     content : z.string().min(10 ,{message : "Content must be at least of 300 characters"}).max(300 ,{message : "Content must be no longer than 10 characters"})
})