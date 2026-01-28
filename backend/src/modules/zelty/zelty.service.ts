import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosError, AxiosInstance } from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ZeltyService {
  private readonly logger = new Logger(ZeltyService.name);
  private readonly zeltyApiKey: string;
  private readonly client: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.zeltyApiKey = this.configService.getOrThrow<string>('API_ZELTY_KEY');
    this.client = this.createClient();
  }

  getClient(): AxiosInstance {
    return this.client;
  }

  private createClient(): AxiosInstance {
    const client = axios.create({
      baseURL: 'https://api.zelty.fr/2.7/',
      headers: {
        Authorization: `Bearer ${this.zeltyApiKey}`,
      },
    });

    client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.logAxiosError(error);

        return Promise.reject(error);
      },
    );

    return client;
  }

  private logAxiosError(error: AxiosError): void {
    const { config, response, message, code } = error;

    const errorDetails = {
      message,
      code,
      url: config?.url,
      method: config?.method?.toUpperCase(),
      baseURL: config?.baseURL,
      status: response?.status,
      statusText: response?.statusText,
      responseData: response?.data,
      requestHeaders: this.sanitizeHeaders(config?.headers),
      responseHeaders: response?.headers,
    };

    this.logger.error(
      `Axios request failed: ${config?.method?.toUpperCase()} ${config?.url}`,
      JSON.stringify(errorDetails, null, 2),
    );
  }

  private sanitizeHeaders(
    headers: Record<string, unknown> | undefined,
  ): Record<string, unknown> | undefined {
    if (!headers) {
      return undefined;
    }

    const sanitized = { ...headers };
    const sensitiveKeys = ['authorization', 'cookie', 'x-api-key'];

    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
