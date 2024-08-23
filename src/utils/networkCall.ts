export interface NetworkCallResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

const networkCall = async <T>(
  url: string,
  method: "GET" | "POST" | "PUT" | "DELETE",
  body?: string,
  headers: HeadersInit = {
    "Content-Type": "application/json",
  }
): Promise<NetworkCallResponse<T>> => {
  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    const status = response.status;
    const data = await response.json();

    if (response.ok) {
      return { data, status};
    } else {
      return { error: data.error || "An error occurred", status, };
    }
  } catch (error) {
    if(error instanceof Error)
    return { error: error.message, status: 500 };
    else 
    return { error:"Network error",status:500};
  }
};

export default networkCall;
