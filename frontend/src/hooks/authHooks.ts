import { supabase } from "../lib/supabaseClient";

export const createUserProfile = async (): Promise<void> => {
    const { data: {session} } = await supabase.auth.getSession()
    const token = session?.access_token
    if (!token) return
    
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/createUser`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}