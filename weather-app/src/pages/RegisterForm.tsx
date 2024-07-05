import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod'

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

type RegisterData = z.infer<typeof registerSchema>

export default function RegisterForm() {
    const { 
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<RegisterData>({
        resolver: zodResolver(registerSchema),
      });

    async function registerUser(values : RegisterData) {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(values)
        });
        const data = await response.json();
        console.log(data);
    }

    return(
        <div>  
            <h3>Inscription</h3>
            <form onSubmit={handleSubmit(registerUser)}>
                <div>
                    <label htmlFor="email">E-mail : </label>
                    <input {...register('email')} type="email" />
                    {errors.email?.message && <p>{errors.email?.message}</p>}
                </div>
                <div>
                    <label htmlFor="pass">Mot de passe : </label>
                    <input {...register('password')} type="password" />
                    {errors.password?.message && <p>{errors.password?.message}</p>}
                </div>
                <div>
                    <button type="submit">Inscription</button>
                </div>
            </form>
        </div>
    )
}