import * as z from "zod"

const UserValidations = z.object({
    profile_photo: z.string().url().min(1),
    name: z.string().min(3, { message: 'MINIMUM 3 CHAR' }).max(30),
    username: z.string().min(3, { message: 'MINIMUM 3 CHAR' }).max(30),
    bio: z.string().min(3, { message: 'MINIMUM 3 CHAR' }).max(1000),
})

export default UserValidations;