import prisma from "../lib/prisma";

export const findOrCreateUser = async (supabaseUid: string) => {
    let user = await prisma.users.findUnique({
        where: { supabase_uid: supabaseUid },
    });

    // If user does not exist, create a new one
    if (!user) {
        user = await prisma.users.create({
            data: {
                supabase_uid: supabaseUid,
            }
        });
    }

    // Return the existing or newly created user
    return user;
};
