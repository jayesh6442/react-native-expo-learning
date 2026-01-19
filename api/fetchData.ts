import { useEffect, useState } from "react";

interface UseFetchResponse<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

export function useFetch<T = any>(url: string): UseFetchResponse<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(
                        `HTTP Error: ${response.status} ${response.statusText}`,
                    );
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "An unknown error occurred";
                setError(errorMessage);
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        if (url) {
            fetchData();
        }
    }, [url]);

    return { data, loading, error };
}
