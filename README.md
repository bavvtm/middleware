
## @callmeumm/middleware
> Simple middleware made on node.js

| 📖 [See Docs Here](docs/modules.md) |
|-------------------------------------|

### Features
- Working with async/await
- Zero dependencies
- Native Promise

### Usage
```js
const { Composer } = require("@callmeumm/middleware");
const composer = new Composer({
	name: "",
	status: ""
});

composer.compose([
	(ctx) => {
		ctx.data.name = "Pak Asep";
		ctx.next();
	},
	(ctx) => {
		ctx.data.status = "Single Ting ting";
		ctx.next();
	},
	(ctx) => {
		console.log(ctx.data);
	}
]).run();
```
