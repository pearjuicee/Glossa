import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { AuthResponse, AuthTokenResponsePassword, User, OAuthResponse, AuthError } from "@supabase/supabase-js";

type AuthContextType = {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<AuthTokenResponsePassword>;
    signOut: () => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string) => Promise<AuthResponse>;
    signInWithGithub: () => Promise<OAuthResponse>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [])

    const value = {
        user,
        loading,
        signIn: (email: string, password: string) => supabase.auth.signInWithPassword({ email, password }),
        signUp: (email: string, password: string) => supabase.auth.signUp({ email, password }),
        signOut: () => supabase.auth.signOut(),
        signInWithGithub: () => supabase.auth.signInWithOAuth({ 
            provider: 'github',
            options: { redirectTo: `${window.location.origin}/auth/callback` }
        }),
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}