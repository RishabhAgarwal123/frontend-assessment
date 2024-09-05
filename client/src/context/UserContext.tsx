import React, { createContext, useEffect, useContext, ReactNode } from 'react';
import { useGet, usePost, usePatch, useDelete } from '../hooks/api';

interface User {
    id?: string;
    name: string;
    email: string;
}

interface UsersResponse {
    users: User[];
}

interface UserContextType {
    users: User[] | null;
    addUser: (user: User) => void;
    updateUser: (user: User, id: string) => void;
    deleteUser: (userId: string) => void;
    error: string | null;
    loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { data: usersResponse, error, loading, getData } = useGet<UsersResponse>('/users');
    const { postData } = usePost<User>('/users');
    const { patchData } = usePatch<User>('/users');
    const { deletedData } = useDelete<void>('/users');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                await getData();
            } catch (err) {
                console.error('Failed to fetch users:', err);
            }
        };

        fetchUsers(); // Fetch users initially
    }, [getData]);

    const addUser = async (user: User) => {
        try {
            await postData(user);
            await getData(); // Refetch users after adding
        } catch (err) {
            console.error('Failed to add user:', err);
        }
    };

    const updateUser = async (user: User, id: string) => {
        try {
            await patchData(user, id);
            await getData(); // Refetch users after updating
        } catch (err) {
            console.error('Failed to update user:', err);
        }
    };

    const deleteUser = async (userId: string) => {
        try {
            await deletedData(userId); // Pass userId if needed
            await getData(); // Refetch users after deletion
        } catch (err) {
            console.error('Failed to delete user:', err);
        }
    };

    return (
        <UserContext.Provider value={{
            users: usersResponse ? usersResponse.users : null,
            addUser,
            updateUser,
            deleteUser,
            error,
            loading
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUsers must be used within a UserProvider');
    }
    return context;
};
