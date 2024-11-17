// src/hooks/useFetch.ts

import { useState, useEffect } from 'react';

// Define a generic type for the data returned by the fetch
type FetchData<T> = {
  data: T | null;
  isLoading: boolean;
  error: string | null;
};

const useFetch = <T>(endpoint: string): FetchData<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: T = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, isLoading, error };
};

export default useFetch;