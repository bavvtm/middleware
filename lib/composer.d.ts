/** Dafault Options */
interface DefaultOptions {
    delay?: number;
}
/** Middleware */
declare type MiddlewareDefault = Record<string, any>;
declare type MiddlewareUnknownEvent = unknown;
declare type MiddlewareContext<T> = {
    data: T;
    next: () => void;
    back: () => void;
    repeat: () => void;
    skipNext: () => void;
};
declare type MiddlewareConditionFn<T> = (ctx: MiddlewareContext<T>) => Promise<boolean> | boolean;
declare type Middleware<T> = (ctx: MiddlewareContext<T>) => MiddlewareUnknownEvent;
declare type MiddlewareLazy<T> = (ctx: MiddlewareContext<T>) => Promise<Middleware<T>> | Middleware<T>;
declare type MiddlewareCondition<T> = MiddlewareConditionFn<T> | boolean;
/** Event */
interface ComposerEvent {
    run(): void;
}
export declare class Composer<C extends MiddlewareDefault> {
    private data;
    private opts?;
    protected handler: Middleware<C>[];
    private isReversed;
    /** eslint/no-useless-constructor */
    constructor(data: C, opts?: DefaultOptions | undefined);
    /**
     * Add middleware to chain
     * @example
     * composer.use(
     *    (ctx) => {
     *        ctx.next();
     *    }
     * )
     */
    use(middleware: Middleware<C>): this;
    /**
     * Lazies middleware
     * @example
     * composer.lazy(
     *    () => (ctx) => {
     *        ctx.next();
     *    }
     * )
     */
    lazy(middleware: MiddlewareLazy<C>): void;
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
    branch(condition: MiddlewareCondition<C>, trueMiddleware: Middleware<C>, falseMiddleware: Middleware<C>): void;
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
    optional(condition: MiddlewareCondition<C>, middleware: Middleware<C>): void;
    /**
     * Reverse middleware chain
     */
    reverse(): void;
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
    compose(...middleware: Middleware<C>[]): ComposerEvent;
    /**
     * Utils
     */
    private _lazyMiddleware;
    private _branchMiddleware;
    private _optionalMiddleware;
    private static _executor;
}
export default Composer;
