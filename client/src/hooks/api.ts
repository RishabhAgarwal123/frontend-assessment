import { useCallback, useState } from "react"

enum METHODS {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

interface User {
    id?: string,
    name: string,
    email: string
}

const BASE_URL = "http://localhost:4002/api"

const useFetch = <T>() => {
    const [data, setData] = useState<T | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>('');

    const fetchData = useCallback(
        async (url: string, method: METHODS, body?: any) => {
            setLoading(true);
            setError(null);

            try {
                const URL = `${BASE_URL}${url}`
                const response = await fetch(URL, {
                    method,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: method === METHODS.POST || method === METHODS.PATCH ? JSON.stringify(body) : null
                })
                if (!response.ok) throw new Error(`Error: ${response.statusText}`);
                const result = (await response.json()) as T;
                setData(result);
            } catch (error: any) {
                setError(error.mesage || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        }, []
    )

    return { loading, error, data, fetchData };
}

export const useGet = <T>(url: string) => {
    const { loading, error, data, fetchData } = useFetch<T>();

    const getData = useCallback(() => {
        fetchData(`/users`, METHODS.GET);
    }, [fetchData]);

    return { data, error, loading, getData };
}

export const usePost = <T>(url: string) => {
    const { loading, error, data, fetchData } = useFetch<T>();

    const postData = useCallback((paylaod: User) => {
        fetchData(url, METHODS.POST, paylaod);
    }, [url, fetchData]);

    return { data, error, loading, postData };
}

export const usePatch = <T>(url: string) => {
    const { loading, error, data, fetchData } = useFetch<T>();

    const patchData = useCallback((paylaod: User, id: string) => {
        fetchData(`${url}/${id}`, METHODS.PATCH, paylaod);
    }, [url, fetchData]);

    return { data, error, loading, patchData };
}

export const useDelete = <T>(url: string) => {
    const { loading, error, data, fetchData } = useFetch<T>();

    const deletedData =  useCallback((id: string) => {
        fetchData(`${url}/${id}`, METHODS.DELETE);
    }, [url, fetchData]);

    return { data, error, loading, deletedData };
}