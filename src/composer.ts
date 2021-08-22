// Tiny Middleware
// Copyright (C) 2021 CallMeUmm <https://github.com/callmeumm>
// is a free software: you can redistribute it and/or modify
// it under the terms of the MIT License as published.

/** Dafault Options */
interface DefaultOptions {
    delay?: number; // delay in millisecond(ms)
}

/** Middleware */
type MiddlewareDefault = Record<string, any>;
type MiddlewareUnknownEvent = unknown;
type MiddlewareContext<T> = {
    data: T;
    next: () => void;
    back: () => void;
    repeat: () => void;
    skipNext: () => void;
};
type MiddlewareConditionFn<T> = (ctx: MiddlewareContext<T>) => Promise<boolean> | boolean;
type Middleware<T> = (
    ctx: MiddlewareContext<T>
) => MiddlewareUnknownEvent;
type MiddlewareLazy<T> = (
    ctx: MiddlewareContext<T>
) => Promise<Middleware<T>> | Middleware<T>;
type MiddlewareCondition<T> = MiddlewareConditionFn<T> | boolean;

/** Event */
interface ComposerEvent {
    run(): void;
}

export class Composer<C extends MiddlewareDefault> {
    protected handler: Middleware<C>[] = [];
    private isReversed: boolean = false;

    /** eslint/no-useless-constructor */
    constructor (
        private data: C,
        private opts?: DefaultOptions
    ) {}

    /**
     * Add middleware to chain
     * @example
     * composer.use(
     *    (ctx) => {
     *        ctx.next();
     *    }
     * )
     */
    public use (
      middleware: Middleware<C>
    ) {
      this.handler.push(middleware);
      return this;
    }

    /**
     * Lazies middleware
     * @example
     * composer.lazy(
     *    () => (ctx) => {
     *        ctx.next();
     *    }
     * )
     */
    public lazy (
      middleware: MiddlewareLazy<C>
    ) {
      this.use(
        this._lazyMiddleware(middleware)
      );
    }

    /**
     * Conditionaly select the middleware is running
     * @example
     * composer.branch(
     *    (ctx) => {
     *        return false;
     *    },
     *    (ctx) => {
     *        ctx.data.message = "Pak Asep Meresahkan";
     *        ctx.next();
     *    },
     *    (ctx) => {
     *        ctx.data.message = "Pak Asep Membagongkan";
     *        ctx.next();
     *    }
     * )
     */
    public branch (
      condition: MiddlewareCondition<C>,
      trueMiddleware: Middleware<C>,
      falseMiddleware: Middleware<C>
    ) {
      this.use(
        this._branchMiddleware(condition, trueMiddleware, falseMiddleware)
      );
    }

    /**
     * Conditionaly skip a middleware
     * @example
     * composer.optional(
     *    (ctx) => {
     *        return false;
     *    },
     *    (ctx) => {
     *        ctx.data.message = "Pak Asep Meresahkan";
     *        ctx.next();
     *    }
     * )
     */
    public optional (
      condition: MiddlewareCondition<C>,
      middleware: Middleware<C>
    ) {
      this.use(
        this._optionalMiddleware(condition, middleware)
      );
    }

    /**
     * Reverse middleware chain
     */
    public reverse () {
      this.isReversed = true;
    }

    /**
     * Compose middleware
     * @example
     * const middleware = composer.compose();
     * // or
     * const middleware = composer.compose([
     *    (ctx) => {
     *        ctx.next();
     *    }
     * ]);
     */
    public compose (
      ...middleware: Middleware<C>[]
    ): ComposerEvent {
      let md = this.handler.concat(middleware);
      const dt = this.data;
      const ms = this.opts?.delay ? this.opts.delay : 0;
      if (this.isReversed) md = md.reverse();
      return {
        run () {
          return Composer._executor<C>(0, dt, md, ms);
        }
      };
    }

    /**
     * Utils
     */
    private _lazyMiddleware (
      target: MiddlewareLazy<C>
    ) {
      let middleware: Middleware<C> | undefined;
      return async (ctx: MiddlewareContext<C>) => {
        if (middleware === undefined) middleware = await target(ctx);
        return middleware(ctx);
      };
    }

    private _branchMiddleware (
      condition: MiddlewareCondition<C>,
      trueMiddleware: Middleware<C>,
      falseMiddleware: Middleware<C>
    ) {
      if (typeof condition !== "function") {
        return condition
          ? trueMiddleware
          : falseMiddleware;
      } else {
        return async (ctx: MiddlewareContext<C>) => (
          await condition(ctx)
            ? trueMiddleware(ctx)
            : falseMiddleware(ctx)
        );
      }
    }

    private _optionalMiddleware (
      condition: MiddlewareCondition<C>,
      middleware: Middleware<C>
    ) {
      const handler: Middleware<C> = (ctx) => ctx.next();
      if (typeof condition !== "function") {
        return condition
          ? middleware
          : handler;
      } else {
        return async (ctx: MiddlewareContext<C>) => (
          await condition(ctx)
            ? middleware
            : handler
        );
      }
    }

    private static _executor<T> (
      lastIndex: number,
      data: T,
      middleware: Middleware<T>[],
      delay: number
    ): MiddlewareUnknownEvent {
      const event = middleware[lastIndex];
      const context: MiddlewareContext<T> = {
        data: data,
        next: () => {
          Composer._executor(lastIndex + 1, data, middleware, delay);
        },
        back: () => {
          Composer._executor(lastIndex - 1, data, middleware, delay);
        },
        repeat: () => {
          Composer._executor(lastIndex, data, middleware, delay);
        },
        skipNext: () => {
          Composer._executor(lastIndex + 2, data, middleware, delay);
        }
      };

    if (event === undefined) return;
    setTimeout(function () {
      return event(context);
    }, delay);
  }
}

export default Composer;