import {createEnv}  from '@t3-oss/env-nextjs'
import {z} from 'zod'
export const env = createEnv({
    emptyStringAsUndefined : true,
    server : {
        DATABASE_URL : z.string().url(),
        CLERK_SECRET_KEY : z.string(),
        CLERK_WEBHOOK_SECRAT : z.string()
        
    },
   runtimeEnv : {
    DATABASE_URL : process.env.DATABASE_URL,
    CLERK_WEBHOOK_SECRAT : process.env.CLERK_WEBHOOK_SECRAT,
    CLERK_SECRET_KEY : process.env.CLERK_SECRET_KEY
   }
})