import z from "zod";

export const MessagesSchema = z.object({
     content : z.string()
          .trim()
          .min(10 ,{message : "Message must be at least 10 characters"})
          .max(300 ,{message : "Message must be no longer than 300 characters"})
})