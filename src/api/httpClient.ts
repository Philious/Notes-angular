
export interface HttpClientT {
  get<R>(url: string): Promise<HttpResponse<R>>;
  put<T, R>(url: string, body: T): Promise<HttpResponse<R>>;
  post<T, R>(url: string, body: T): Promise<HttpResponse<R>>;
  delete<R extends boolean>(url: string): Promise<HttpResponse<R>>;
}

export class HttpResponse<T> {
  constructor(
    public ok: boolean,
    public statusCode: number,
    public body?: T
  ) { }
}

export class HttpClient implements HttpClientT {
  constructor(protected baseUrl: string, protected cookies?: string) { }
  private tries = 0;

  private async sendRequest<T, R>(
    url: string,
    method: "GET" | "PUT" | "POST" | "DELETE",
    body?: T
  ): Promise<HttpResponse<R>> {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Accept", "application/json");

    if (this.cookies) headers.append("Cookie", this.cookies);
    try {
      const response = await fetch(url, {
        headers,
        credentials: 'include',
        method,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        this.tries = 0;
        const isJson = response.headers
          .get("content-type")
          ?.includes("application/json");

        return new HttpResponse<R>(
          response.ok,
          response.status,
          isJson ? ((await response.json()) as R) : undefined
        );
      } else if (response.status >= 500) {
        this.tries++;
        if (this.tries > 5) throw new Error(response.statusText);

        return await this.sendRequest(url, method, body);
      }

      return new HttpResponse<R>(response.ok, response.status, undefined);
    } catch (err) {
      console.error(err);
      return new HttpResponse<R>(false, 0, undefined);
    }
  }

  public async get<R>(url: string): Promise<HttpResponse<R>> {
    return this.sendRequest<undefined, R>(`${this.baseUrl}/${url}`, "GET");
  }

  public async put<T, R>(url: string, body: T): Promise<HttpResponse<R>> {
    return this.sendRequest<T, R>(`${this.baseUrl}/${url}`, "PUT", body);
  }

  public async post<T, R>(url: string, body: T): Promise<HttpResponse<R>> {
    return this.sendRequest<T, R>(`${this.baseUrl}/${url}`, "POST", body);
  }

  public async delete<R extends boolean>(url: string): Promise<HttpResponse<R>> {
    return this.sendRequest<undefined, R>(`${this.baseUrl}/${url}`, "DELETE");
  }
}
