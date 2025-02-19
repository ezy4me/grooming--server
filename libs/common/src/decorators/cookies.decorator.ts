import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const Cookie = createParamDecorator(
  (
    key: string | undefined,
    ctx: ExecutionContext,
  ): string | Record<string, string> | null => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.cookies || typeof request.cookies !== 'object') {
      return key ? null : {};
    }

    const cookies: Record<string, string> = request.cookies as Record<
      string,
      string
    >;

    return key ? (cookies[key] ?? null) : cookies;
  },
);
