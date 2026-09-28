import { User } from "@supabase/supabase-js"

declare global {
    namespace Express {

        interface Request {
            user?: User

            employee?: {
                id: string
                name: string
                role: string
                active: boolean
            }
        }
    }
}

export {}