"use strict";
// Tiny Middleware
// Copyright (C) 2021 CallMeUmm <https://github.com/callmeumm>
// is a free software: you can redistribute it and/or modify
// it under the terms of the MIT License as published.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Composer = void 0;
class Composer {
    /** eslint/no-useless-constructor */
    constructor(data, opts) {
        this.data = data;
        this.opts = opts;
        this.handler = [];
        this.isReversed = false;
    }
    /**
     * Add middleware to chain
     * @example
     * composer.use(
     *    (ctx) => {
     *        ctx.next();
     *    }
     * )
     */
    use(middleware) {
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
    lazy(middleware) {
        this.use(this._lazyMiddleware(middleware));
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
    branch(condition, trueMiddleware, falseMiddleware) {
        this.use(this._branchMiddleware(condition, trueMiddleware, falseMiddleware));
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
    optional(condition, middleware) {
        this.use(this._optionalMiddleware(condition, middleware));
    }
    /**
     * Reverse middleware chain
     */
    reverse() {
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
    compose(...middleware) {
        var _a;
        let md = this.handler.concat(middleware);
        const dt = this.data;
        const ms = ((_a = this.opts) === null || _a === void 0 ? void 0 : _a.delay) ? this.opts.delay : 0;
        if (this.isReversed)
            md = md.reverse();
        return {
            run() {
                return Composer._executor(0, dt, md, ms);
            }
        };
    }
    /**
     * Utils
     */
    _lazyMiddleware(target) {
        let middleware;
        return async (ctx) => {
            if (middleware === undefined)
                middleware = await target(ctx);
            return middleware(ctx);
        };
    }
    _branchMiddleware(condition, trueMiddleware, falseMiddleware) {
        if (typeof condition !== "function") {
            return condition
                ? trueMiddleware
                : falseMiddleware;
        }
        else {
            return async (ctx) => (await condition(ctx)
                ? trueMiddleware(ctx)
                : falseMiddleware(ctx));
        }
    }
    _optionalMiddleware(condition, middleware) {
        const handler = (ctx) => ctx.next();
        if (typeof condition !== "function") {
            return condition
                ? middleware
                : handler;
        }
        else {
            return async (ctx) => (await condition(ctx)
                ? middleware
                : handler);
        }
    }
    static _executor(lastIndex, data, middleware, delay) {
        const event = middleware[lastIndex];
        const context = {
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
        if (event === undefined)
            return;
        setTimeout(function () {
            return event(context);
        }, delay);
    }
}
exports.Composer = Composer;
exports.default = Composer;
