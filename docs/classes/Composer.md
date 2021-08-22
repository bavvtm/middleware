[@callmeumm/middleware](../README.md) / [Exports](../modules.md) / Composer

# Class: Composer<C\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends `MiddlewareDefault` |

## Table of contents

### Constructors

- [constructor](Composer.md#constructor)

### Properties

- [handler](Composer.md#handler)
- [isReversed](Composer.md#isreversed)

### Methods

- [\_branchMiddleware](Composer.md#_branchmiddleware)
- [\_lazyMiddleware](Composer.md#_lazymiddleware)
- [\_optionalMiddleware](Composer.md#_optionalmiddleware)
- [branch](Composer.md#branch)
- [compose](Composer.md#compose)
- [lazy](Composer.md#lazy)
- [optional](Composer.md#optional)
- [reverse](Composer.md#reverse)
- [use](Composer.md#use)
- [\_executor](Composer.md#_executor)

## Constructors

### constructor

• **new Composer**<`C`\>(`data`, `opts?`)

eslint/no-useless-constructor

#### Type parameters

| Name | Type |
| :------ | :------ |
| `C` | extends `MiddlewareDefault` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `C` |
| `opts?` | `DefaultOptions` |

#### Defined in

composer.ts:40

## Properties

### handler

• `Protected` **handler**: `Middleware`<`C`\>[] = `[]`

#### Defined in

composer.ts:36

___

### isReversed

• `Private` **isReversed**: `boolean` = `false`

#### Defined in

composer.ts:37

## Methods

### \_branchMiddleware

▸ `Private` **_branchMiddleware**(`condition`, `trueMiddleware`, `falseMiddleware`): `Middleware`<`C`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `condition` | `MiddlewareCondition`<`C`\> |
| `trueMiddleware` | `Middleware`<`C`\> |
| `falseMiddleware` | `Middleware`<`C`\> |

#### Returns

`Middleware`<`C`\>

#### Defined in

composer.ts:172

___

### \_lazyMiddleware

▸ `Private` **_lazyMiddleware**(`target`): (`ctx`: `MiddlewareContext`<`C`\>) => `Promise`<`unknown`\>

Utils

#### Parameters

| Name | Type |
| :------ | :------ |
| `target` | `MiddlewareLazy`<`C`\> |

#### Returns

`fn`

▸ (`ctx`): `Promise`<`unknown`\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `ctx` | `MiddlewareContext`<`C`\> |

##### Returns

`Promise`<`unknown`\>

#### Defined in

composer.ts:162

___

### \_optionalMiddleware

▸ `Private` **_optionalMiddleware**(`condition`, `middleware`): `Middleware`<`C`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `condition` | `MiddlewareCondition`<`C`\> |
| `middleware` | `Middleware`<`C`\> |

#### Returns

`Middleware`<`C`\>

#### Defined in

composer.ts:190

___

### branch

▸ **branch**(`condition`, `trueMiddleware`, `falseMiddleware`): `void`

Conditionaly select the middleware is running

**`example`**
``` typescript
composer.branch(
    (ctx) => {
        return false;
    },
    (ctx) => {
        ctx.data.message = "Pak Asep Meresahkan";
        ctx.next();
    },
    (ctx) => {
        ctx.data.message = "Pak Asep Membagongkan";
        ctx.next();
    }
)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `condition` | `MiddlewareCondition`<`C`\> |
| `trueMiddleware` | `Middleware`<`C`\> |
| `falseMiddleware` | `Middleware`<`C`\> |

#### Returns

`void`

#### Defined in

composer.ts:95

___

### compose

▸ **compose**(...`middleware`): `ComposerEvent`

Compose middleware

**`example`**
``` typescript
const middleware = composer.compose();
// or
const middleware = composer.compose([
    (ctx) => {
        ctx.next();
    }
]);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `...middleware` | `Middleware`<`C`\>[] |

#### Returns

`ComposerEvent`

#### Defined in

composer.ts:145

___

### lazy

▸ **lazy**(`middleware`): `void`

Lazies middleware

**`example`**
``` typescript
composer.lazy(
    () => (ctx) => {
        ctx.next();
    }
)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `middleware` | `MiddlewareLazy`<`C`\> |

#### Returns

`void`

#### Defined in

composer.ts:70

___

### optional

▸ **optional**(`condition`, `middleware`): `void`

Conditionaly skip a middleware

**`example`**
``` typescript
composer.optional(
    (ctx) => {
        return false;
    },
    (ctx) => {
        ctx.data.message = "Pak Asep Meresahkan";
        ctx.next();
    }
)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `condition` | `MiddlewareCondition`<`C`\> |
| `middleware` | `Middleware`<`C`\> |

#### Returns

`void`

#### Defined in

composer.ts:118

___

### reverse

▸ **reverse**(): `void`

Reverse middleware chain

#### Returns

`void`

#### Defined in

composer.ts:130

___

### use

▸ **use**(`middleware`): [`Composer`](Composer.md)<`C`\>

Add middleware to chain

**`example`**
``` typescript
composer.use(
   (ctx) => {
       ctx.next();
   }
)
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `middleware` | `Middleware`<`C`\> |

#### Returns

[`Composer`](Composer.md)<`C`\>

#### Defined in

composer.ts:54

___

### \_executor

▸ `Static` `Private` **_executor**<`T`\>(`lastIndex`, `data`, `middleware`, `delay`): `unknown`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `lastIndex` | `number` |
| `data` | `T` |
| `middleware` | `Middleware`<`T`\>[] |
| `delay` | `number` |

#### Returns

`unknown`

#### Defined in

composer.ts:208
