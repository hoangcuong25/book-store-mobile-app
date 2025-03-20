import { create } from 'zustand'

export const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isLoading: false,

    register: async (username, email, password) => {
        set({ isLoading: true })

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error("Some thing wrong")

        } catch (error) {
            console.log(error)
        }
    }

}))