import { Composer } from "../src/index";

describe("composer", (): void => {
    it("use event", (): void => {
        const composer = new Composer({
            name: "",
            email: ""
        });
        composer.use((ctx) => {
            ctx.data.name = "Test";
            ctx.next();
        });
        composer.use((ctx) => {
            ctx.data.email = "Test@any.com";
            ctx.next();
        });
        composer.use((ctx) => {
            return ctx.data;
        });
        const middleware = composer.compose();
        middleware.run();
    });
});