
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model CustomRequest
 * 
 */
export type CustomRequest = $Result.DefaultSelection<Prisma.$CustomRequestPayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more CustomRequests
 * const customRequests = await prisma.customRequest.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more CustomRequests
   * const customRequests = await prisma.customRequest.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.customRequest`: Exposes CRUD operations for the **CustomRequest** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more CustomRequests
    * const customRequests = await prisma.customRequest.findMany()
    * ```
    */
  get customRequest(): Prisma.CustomRequestDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    CustomRequest: 'CustomRequest'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "customRequest"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      CustomRequest: {
        payload: Prisma.$CustomRequestPayload<ExtArgs>
        fields: Prisma.CustomRequestFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CustomRequestFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomRequestPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CustomRequestFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomRequestPayload>
          }
          findFirst: {
            args: Prisma.CustomRequestFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomRequestPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CustomRequestFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomRequestPayload>
          }
          findMany: {
            args: Prisma.CustomRequestFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomRequestPayload>[]
          }
          create: {
            args: Prisma.CustomRequestCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomRequestPayload>
          }
          createMany: {
            args: Prisma.CustomRequestCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.CustomRequestDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomRequestPayload>
          }
          update: {
            args: Prisma.CustomRequestUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomRequestPayload>
          }
          deleteMany: {
            args: Prisma.CustomRequestDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CustomRequestUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.CustomRequestUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CustomRequestPayload>
          }
          aggregate: {
            args: Prisma.CustomRequestAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCustomRequest>
          }
          groupBy: {
            args: Prisma.CustomRequestGroupByArgs<ExtArgs>
            result: $Utils.Optional<CustomRequestGroupByOutputType>[]
          }
          count: {
            args: Prisma.CustomRequestCountArgs<ExtArgs>
            result: $Utils.Optional<CustomRequestCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model CustomRequest
   */

  export type AggregateCustomRequest = {
    _count: CustomRequestCountAggregateOutputType | null
    _avg: CustomRequestAvgAggregateOutputType | null
    _sum: CustomRequestSumAggregateOutputType | null
    _min: CustomRequestMinAggregateOutputType | null
    _max: CustomRequestMaxAggregateOutputType | null
  }

  export type CustomRequestAvgAggregateOutputType = {
    adminQuotePrice: number | null
  }

  export type CustomRequestSumAggregateOutputType = {
    adminQuotePrice: number | null
  }

  export type CustomRequestMinAggregateOutputType = {
    id: string | null
    userId: string | null
    productCategory: string | null
    description: string | null
    budgetRange: string | null
    status: string | null
    adminQuotePrice: number | null
    adminQuoteEta: string | null
    adminQuoteNotes: string | null
    convertedOrderId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomRequestMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    productCategory: string | null
    description: string | null
    budgetRange: string | null
    status: string | null
    adminQuotePrice: number | null
    adminQuoteEta: string | null
    adminQuoteNotes: string | null
    convertedOrderId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CustomRequestCountAggregateOutputType = {
    id: number
    userId: number
    productCategory: number
    description: number
    referenceImages: number
    budgetRange: number
    status: number
    adminQuotePrice: number
    adminQuoteEta: number
    adminQuoteNotes: number
    convertedOrderId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CustomRequestAvgAggregateInputType = {
    adminQuotePrice?: true
  }

  export type CustomRequestSumAggregateInputType = {
    adminQuotePrice?: true
  }

  export type CustomRequestMinAggregateInputType = {
    id?: true
    userId?: true
    productCategory?: true
    description?: true
    budgetRange?: true
    status?: true
    adminQuotePrice?: true
    adminQuoteEta?: true
    adminQuoteNotes?: true
    convertedOrderId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomRequestMaxAggregateInputType = {
    id?: true
    userId?: true
    productCategory?: true
    description?: true
    budgetRange?: true
    status?: true
    adminQuotePrice?: true
    adminQuoteEta?: true
    adminQuoteNotes?: true
    convertedOrderId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CustomRequestCountAggregateInputType = {
    id?: true
    userId?: true
    productCategory?: true
    description?: true
    referenceImages?: true
    budgetRange?: true
    status?: true
    adminQuotePrice?: true
    adminQuoteEta?: true
    adminQuoteNotes?: true
    convertedOrderId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CustomRequestAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomRequest to aggregate.
     */
    where?: CustomRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomRequests to fetch.
     */
    orderBy?: CustomRequestOrderByWithRelationInput | CustomRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CustomRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned CustomRequests
    **/
    _count?: true | CustomRequestCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CustomRequestAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CustomRequestSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CustomRequestMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CustomRequestMaxAggregateInputType
  }

  export type GetCustomRequestAggregateType<T extends CustomRequestAggregateArgs> = {
        [P in keyof T & keyof AggregateCustomRequest]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCustomRequest[P]>
      : GetScalarType<T[P], AggregateCustomRequest[P]>
  }




  export type CustomRequestGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CustomRequestWhereInput
    orderBy?: CustomRequestOrderByWithAggregationInput | CustomRequestOrderByWithAggregationInput[]
    by: CustomRequestScalarFieldEnum[] | CustomRequestScalarFieldEnum
    having?: CustomRequestScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CustomRequestCountAggregateInputType | true
    _avg?: CustomRequestAvgAggregateInputType
    _sum?: CustomRequestSumAggregateInputType
    _min?: CustomRequestMinAggregateInputType
    _max?: CustomRequestMaxAggregateInputType
  }

  export type CustomRequestGroupByOutputType = {
    id: string
    userId: string
    productCategory: string
    description: string
    referenceImages: JsonValue
    budgetRange: string
    status: string
    adminQuotePrice: number | null
    adminQuoteEta: string | null
    adminQuoteNotes: string | null
    convertedOrderId: string | null
    createdAt: Date
    updatedAt: Date
    _count: CustomRequestCountAggregateOutputType | null
    _avg: CustomRequestAvgAggregateOutputType | null
    _sum: CustomRequestSumAggregateOutputType | null
    _min: CustomRequestMinAggregateOutputType | null
    _max: CustomRequestMaxAggregateOutputType | null
  }

  type GetCustomRequestGroupByPayload<T extends CustomRequestGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CustomRequestGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CustomRequestGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CustomRequestGroupByOutputType[P]>
            : GetScalarType<T[P], CustomRequestGroupByOutputType[P]>
        }
      >
    >


  export type CustomRequestSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    productCategory?: boolean
    description?: boolean
    referenceImages?: boolean
    budgetRange?: boolean
    status?: boolean
    adminQuotePrice?: boolean
    adminQuoteEta?: boolean
    adminQuoteNotes?: boolean
    convertedOrderId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["customRequest"]>


  export type CustomRequestSelectScalar = {
    id?: boolean
    userId?: boolean
    productCategory?: boolean
    description?: boolean
    referenceImages?: boolean
    budgetRange?: boolean
    status?: boolean
    adminQuotePrice?: boolean
    adminQuoteEta?: boolean
    adminQuoteNotes?: boolean
    convertedOrderId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }


  export type $CustomRequestPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "CustomRequest"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      productCategory: string
      description: string
      referenceImages: Prisma.JsonValue
      budgetRange: string
      status: string
      adminQuotePrice: number | null
      adminQuoteEta: string | null
      adminQuoteNotes: string | null
      convertedOrderId: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["customRequest"]>
    composites: {}
  }

  type CustomRequestGetPayload<S extends boolean | null | undefined | CustomRequestDefaultArgs> = $Result.GetResult<Prisma.$CustomRequestPayload, S>

  type CustomRequestCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<CustomRequestFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: CustomRequestCountAggregateInputType | true
    }

  export interface CustomRequestDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['CustomRequest'], meta: { name: 'CustomRequest' } }
    /**
     * Find zero or one CustomRequest that matches the filter.
     * @param {CustomRequestFindUniqueArgs} args - Arguments to find a CustomRequest
     * @example
     * // Get one CustomRequest
     * const customRequest = await prisma.customRequest.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CustomRequestFindUniqueArgs>(args: SelectSubset<T, CustomRequestFindUniqueArgs<ExtArgs>>): Prisma__CustomRequestClient<$Result.GetResult<Prisma.$CustomRequestPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one CustomRequest that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {CustomRequestFindUniqueOrThrowArgs} args - Arguments to find a CustomRequest
     * @example
     * // Get one CustomRequest
     * const customRequest = await prisma.customRequest.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CustomRequestFindUniqueOrThrowArgs>(args: SelectSubset<T, CustomRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CustomRequestClient<$Result.GetResult<Prisma.$CustomRequestPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first CustomRequest that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomRequestFindFirstArgs} args - Arguments to find a CustomRequest
     * @example
     * // Get one CustomRequest
     * const customRequest = await prisma.customRequest.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CustomRequestFindFirstArgs>(args?: SelectSubset<T, CustomRequestFindFirstArgs<ExtArgs>>): Prisma__CustomRequestClient<$Result.GetResult<Prisma.$CustomRequestPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first CustomRequest that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomRequestFindFirstOrThrowArgs} args - Arguments to find a CustomRequest
     * @example
     * // Get one CustomRequest
     * const customRequest = await prisma.customRequest.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CustomRequestFindFirstOrThrowArgs>(args?: SelectSubset<T, CustomRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma__CustomRequestClient<$Result.GetResult<Prisma.$CustomRequestPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more CustomRequests that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomRequestFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CustomRequests
     * const customRequests = await prisma.customRequest.findMany()
     * 
     * // Get first 10 CustomRequests
     * const customRequests = await prisma.customRequest.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const customRequestWithIdOnly = await prisma.customRequest.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CustomRequestFindManyArgs>(args?: SelectSubset<T, CustomRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CustomRequestPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a CustomRequest.
     * @param {CustomRequestCreateArgs} args - Arguments to create a CustomRequest.
     * @example
     * // Create one CustomRequest
     * const CustomRequest = await prisma.customRequest.create({
     *   data: {
     *     // ... data to create a CustomRequest
     *   }
     * })
     * 
     */
    create<T extends CustomRequestCreateArgs>(args: SelectSubset<T, CustomRequestCreateArgs<ExtArgs>>): Prisma__CustomRequestClient<$Result.GetResult<Prisma.$CustomRequestPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many CustomRequests.
     * @param {CustomRequestCreateManyArgs} args - Arguments to create many CustomRequests.
     * @example
     * // Create many CustomRequests
     * const customRequest = await prisma.customRequest.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CustomRequestCreateManyArgs>(args?: SelectSubset<T, CustomRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a CustomRequest.
     * @param {CustomRequestDeleteArgs} args - Arguments to delete one CustomRequest.
     * @example
     * // Delete one CustomRequest
     * const CustomRequest = await prisma.customRequest.delete({
     *   where: {
     *     // ... filter to delete one CustomRequest
     *   }
     * })
     * 
     */
    delete<T extends CustomRequestDeleteArgs>(args: SelectSubset<T, CustomRequestDeleteArgs<ExtArgs>>): Prisma__CustomRequestClient<$Result.GetResult<Prisma.$CustomRequestPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one CustomRequest.
     * @param {CustomRequestUpdateArgs} args - Arguments to update one CustomRequest.
     * @example
     * // Update one CustomRequest
     * const customRequest = await prisma.customRequest.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CustomRequestUpdateArgs>(args: SelectSubset<T, CustomRequestUpdateArgs<ExtArgs>>): Prisma__CustomRequestClient<$Result.GetResult<Prisma.$CustomRequestPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more CustomRequests.
     * @param {CustomRequestDeleteManyArgs} args - Arguments to filter CustomRequests to delete.
     * @example
     * // Delete a few CustomRequests
     * const { count } = await prisma.customRequest.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CustomRequestDeleteManyArgs>(args?: SelectSubset<T, CustomRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more CustomRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomRequestUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CustomRequests
     * const customRequest = await prisma.customRequest.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CustomRequestUpdateManyArgs>(args: SelectSubset<T, CustomRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one CustomRequest.
     * @param {CustomRequestUpsertArgs} args - Arguments to update or create a CustomRequest.
     * @example
     * // Update or create a CustomRequest
     * const customRequest = await prisma.customRequest.upsert({
     *   create: {
     *     // ... data to create a CustomRequest
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CustomRequest we want to update
     *   }
     * })
     */
    upsert<T extends CustomRequestUpsertArgs>(args: SelectSubset<T, CustomRequestUpsertArgs<ExtArgs>>): Prisma__CustomRequestClient<$Result.GetResult<Prisma.$CustomRequestPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of CustomRequests.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomRequestCountArgs} args - Arguments to filter CustomRequests to count.
     * @example
     * // Count the number of CustomRequests
     * const count = await prisma.customRequest.count({
     *   where: {
     *     // ... the filter for the CustomRequests we want to count
     *   }
     * })
    **/
    count<T extends CustomRequestCountArgs>(
      args?: Subset<T, CustomRequestCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CustomRequestCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a CustomRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomRequestAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CustomRequestAggregateArgs>(args: Subset<T, CustomRequestAggregateArgs>): Prisma.PrismaPromise<GetCustomRequestAggregateType<T>>

    /**
     * Group by CustomRequest.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CustomRequestGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CustomRequestGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CustomRequestGroupByArgs['orderBy'] }
        : { orderBy?: CustomRequestGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CustomRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the CustomRequest model
   */
  readonly fields: CustomRequestFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for CustomRequest.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CustomRequestClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the CustomRequest model
   */ 
  interface CustomRequestFieldRefs {
    readonly id: FieldRef<"CustomRequest", 'String'>
    readonly userId: FieldRef<"CustomRequest", 'String'>
    readonly productCategory: FieldRef<"CustomRequest", 'String'>
    readonly description: FieldRef<"CustomRequest", 'String'>
    readonly referenceImages: FieldRef<"CustomRequest", 'Json'>
    readonly budgetRange: FieldRef<"CustomRequest", 'String'>
    readonly status: FieldRef<"CustomRequest", 'String'>
    readonly adminQuotePrice: FieldRef<"CustomRequest", 'Float'>
    readonly adminQuoteEta: FieldRef<"CustomRequest", 'String'>
    readonly adminQuoteNotes: FieldRef<"CustomRequest", 'String'>
    readonly convertedOrderId: FieldRef<"CustomRequest", 'String'>
    readonly createdAt: FieldRef<"CustomRequest", 'DateTime'>
    readonly updatedAt: FieldRef<"CustomRequest", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * CustomRequest findUnique
   */
  export type CustomRequestFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomRequest
     */
    select?: CustomRequestSelect<ExtArgs> | null
    /**
     * Filter, which CustomRequest to fetch.
     */
    where: CustomRequestWhereUniqueInput
  }

  /**
   * CustomRequest findUniqueOrThrow
   */
  export type CustomRequestFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomRequest
     */
    select?: CustomRequestSelect<ExtArgs> | null
    /**
     * Filter, which CustomRequest to fetch.
     */
    where: CustomRequestWhereUniqueInput
  }

  /**
   * CustomRequest findFirst
   */
  export type CustomRequestFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomRequest
     */
    select?: CustomRequestSelect<ExtArgs> | null
    /**
     * Filter, which CustomRequest to fetch.
     */
    where?: CustomRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomRequests to fetch.
     */
    orderBy?: CustomRequestOrderByWithRelationInput | CustomRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomRequests.
     */
    cursor?: CustomRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomRequests.
     */
    distinct?: CustomRequestScalarFieldEnum | CustomRequestScalarFieldEnum[]
  }

  /**
   * CustomRequest findFirstOrThrow
   */
  export type CustomRequestFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomRequest
     */
    select?: CustomRequestSelect<ExtArgs> | null
    /**
     * Filter, which CustomRequest to fetch.
     */
    where?: CustomRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomRequests to fetch.
     */
    orderBy?: CustomRequestOrderByWithRelationInput | CustomRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for CustomRequests.
     */
    cursor?: CustomRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomRequests.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of CustomRequests.
     */
    distinct?: CustomRequestScalarFieldEnum | CustomRequestScalarFieldEnum[]
  }

  /**
   * CustomRequest findMany
   */
  export type CustomRequestFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomRequest
     */
    select?: CustomRequestSelect<ExtArgs> | null
    /**
     * Filter, which CustomRequests to fetch.
     */
    where?: CustomRequestWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of CustomRequests to fetch.
     */
    orderBy?: CustomRequestOrderByWithRelationInput | CustomRequestOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing CustomRequests.
     */
    cursor?: CustomRequestWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` CustomRequests from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` CustomRequests.
     */
    skip?: number
    distinct?: CustomRequestScalarFieldEnum | CustomRequestScalarFieldEnum[]
  }

  /**
   * CustomRequest create
   */
  export type CustomRequestCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomRequest
     */
    select?: CustomRequestSelect<ExtArgs> | null
    /**
     * The data needed to create a CustomRequest.
     */
    data: XOR<CustomRequestCreateInput, CustomRequestUncheckedCreateInput>
  }

  /**
   * CustomRequest createMany
   */
  export type CustomRequestCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many CustomRequests.
     */
    data: CustomRequestCreateManyInput | CustomRequestCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * CustomRequest update
   */
  export type CustomRequestUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomRequest
     */
    select?: CustomRequestSelect<ExtArgs> | null
    /**
     * The data needed to update a CustomRequest.
     */
    data: XOR<CustomRequestUpdateInput, CustomRequestUncheckedUpdateInput>
    /**
     * Choose, which CustomRequest to update.
     */
    where: CustomRequestWhereUniqueInput
  }

  /**
   * CustomRequest updateMany
   */
  export type CustomRequestUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update CustomRequests.
     */
    data: XOR<CustomRequestUpdateManyMutationInput, CustomRequestUncheckedUpdateManyInput>
    /**
     * Filter which CustomRequests to update
     */
    where?: CustomRequestWhereInput
  }

  /**
   * CustomRequest upsert
   */
  export type CustomRequestUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomRequest
     */
    select?: CustomRequestSelect<ExtArgs> | null
    /**
     * The filter to search for the CustomRequest to update in case it exists.
     */
    where: CustomRequestWhereUniqueInput
    /**
     * In case the CustomRequest found by the `where` argument doesn't exist, create a new CustomRequest with this data.
     */
    create: XOR<CustomRequestCreateInput, CustomRequestUncheckedCreateInput>
    /**
     * In case the CustomRequest was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CustomRequestUpdateInput, CustomRequestUncheckedUpdateInput>
  }

  /**
   * CustomRequest delete
   */
  export type CustomRequestDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomRequest
     */
    select?: CustomRequestSelect<ExtArgs> | null
    /**
     * Filter which CustomRequest to delete.
     */
    where: CustomRequestWhereUniqueInput
  }

  /**
   * CustomRequest deleteMany
   */
  export type CustomRequestDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which CustomRequests to delete
     */
    where?: CustomRequestWhereInput
  }

  /**
   * CustomRequest without action
   */
  export type CustomRequestDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CustomRequest
     */
    select?: CustomRequestSelect<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CustomRequestScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    productCategory: 'productCategory',
    description: 'description',
    referenceImages: 'referenceImages',
    budgetRange: 'budgetRange',
    status: 'status',
    adminQuotePrice: 'adminQuotePrice',
    adminQuoteEta: 'adminQuoteEta',
    adminQuoteNotes: 'adminQuoteNotes',
    convertedOrderId: 'convertedOrderId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CustomRequestScalarFieldEnum = (typeof CustomRequestScalarFieldEnum)[keyof typeof CustomRequestScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type CustomRequestWhereInput = {
    AND?: CustomRequestWhereInput | CustomRequestWhereInput[]
    OR?: CustomRequestWhereInput[]
    NOT?: CustomRequestWhereInput | CustomRequestWhereInput[]
    id?: StringFilter<"CustomRequest"> | string
    userId?: StringFilter<"CustomRequest"> | string
    productCategory?: StringFilter<"CustomRequest"> | string
    description?: StringFilter<"CustomRequest"> | string
    referenceImages?: JsonFilter<"CustomRequest">
    budgetRange?: StringFilter<"CustomRequest"> | string
    status?: StringFilter<"CustomRequest"> | string
    adminQuotePrice?: FloatNullableFilter<"CustomRequest"> | number | null
    adminQuoteEta?: StringNullableFilter<"CustomRequest"> | string | null
    adminQuoteNotes?: StringNullableFilter<"CustomRequest"> | string | null
    convertedOrderId?: StringNullableFilter<"CustomRequest"> | string | null
    createdAt?: DateTimeFilter<"CustomRequest"> | Date | string
    updatedAt?: DateTimeFilter<"CustomRequest"> | Date | string
  }

  export type CustomRequestOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    productCategory?: SortOrder
    description?: SortOrder
    referenceImages?: SortOrder
    budgetRange?: SortOrder
    status?: SortOrder
    adminQuotePrice?: SortOrderInput | SortOrder
    adminQuoteEta?: SortOrderInput | SortOrder
    adminQuoteNotes?: SortOrderInput | SortOrder
    convertedOrderId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CustomRequestWhereInput | CustomRequestWhereInput[]
    OR?: CustomRequestWhereInput[]
    NOT?: CustomRequestWhereInput | CustomRequestWhereInput[]
    userId?: StringFilter<"CustomRequest"> | string
    productCategory?: StringFilter<"CustomRequest"> | string
    description?: StringFilter<"CustomRequest"> | string
    referenceImages?: JsonFilter<"CustomRequest">
    budgetRange?: StringFilter<"CustomRequest"> | string
    status?: StringFilter<"CustomRequest"> | string
    adminQuotePrice?: FloatNullableFilter<"CustomRequest"> | number | null
    adminQuoteEta?: StringNullableFilter<"CustomRequest"> | string | null
    adminQuoteNotes?: StringNullableFilter<"CustomRequest"> | string | null
    convertedOrderId?: StringNullableFilter<"CustomRequest"> | string | null
    createdAt?: DateTimeFilter<"CustomRequest"> | Date | string
    updatedAt?: DateTimeFilter<"CustomRequest"> | Date | string
  }, "id">

  export type CustomRequestOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    productCategory?: SortOrder
    description?: SortOrder
    referenceImages?: SortOrder
    budgetRange?: SortOrder
    status?: SortOrder
    adminQuotePrice?: SortOrderInput | SortOrder
    adminQuoteEta?: SortOrderInput | SortOrder
    adminQuoteNotes?: SortOrderInput | SortOrder
    convertedOrderId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CustomRequestCountOrderByAggregateInput
    _avg?: CustomRequestAvgOrderByAggregateInput
    _max?: CustomRequestMaxOrderByAggregateInput
    _min?: CustomRequestMinOrderByAggregateInput
    _sum?: CustomRequestSumOrderByAggregateInput
  }

  export type CustomRequestScalarWhereWithAggregatesInput = {
    AND?: CustomRequestScalarWhereWithAggregatesInput | CustomRequestScalarWhereWithAggregatesInput[]
    OR?: CustomRequestScalarWhereWithAggregatesInput[]
    NOT?: CustomRequestScalarWhereWithAggregatesInput | CustomRequestScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"CustomRequest"> | string
    userId?: StringWithAggregatesFilter<"CustomRequest"> | string
    productCategory?: StringWithAggregatesFilter<"CustomRequest"> | string
    description?: StringWithAggregatesFilter<"CustomRequest"> | string
    referenceImages?: JsonWithAggregatesFilter<"CustomRequest">
    budgetRange?: StringWithAggregatesFilter<"CustomRequest"> | string
    status?: StringWithAggregatesFilter<"CustomRequest"> | string
    adminQuotePrice?: FloatNullableWithAggregatesFilter<"CustomRequest"> | number | null
    adminQuoteEta?: StringNullableWithAggregatesFilter<"CustomRequest"> | string | null
    adminQuoteNotes?: StringNullableWithAggregatesFilter<"CustomRequest"> | string | null
    convertedOrderId?: StringNullableWithAggregatesFilter<"CustomRequest"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"CustomRequest"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"CustomRequest"> | Date | string
  }

  export type CustomRequestCreateInput = {
    id?: string
    userId: string
    productCategory: string
    description: string
    referenceImages?: JsonNullValueInput | InputJsonValue
    budgetRange: string
    status?: string
    adminQuotePrice?: number | null
    adminQuoteEta?: string | null
    adminQuoteNotes?: string | null
    convertedOrderId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomRequestUncheckedCreateInput = {
    id?: string
    userId: string
    productCategory: string
    description: string
    referenceImages?: JsonNullValueInput | InputJsonValue
    budgetRange: string
    status?: string
    adminQuotePrice?: number | null
    adminQuoteEta?: string | null
    adminQuoteNotes?: string | null
    convertedOrderId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomRequestUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    productCategory?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    referenceImages?: JsonNullValueInput | InputJsonValue
    budgetRange?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    adminQuotePrice?: NullableFloatFieldUpdateOperationsInput | number | null
    adminQuoteEta?: NullableStringFieldUpdateOperationsInput | string | null
    adminQuoteNotes?: NullableStringFieldUpdateOperationsInput | string | null
    convertedOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomRequestUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    productCategory?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    referenceImages?: JsonNullValueInput | InputJsonValue
    budgetRange?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    adminQuotePrice?: NullableFloatFieldUpdateOperationsInput | number | null
    adminQuoteEta?: NullableStringFieldUpdateOperationsInput | string | null
    adminQuoteNotes?: NullableStringFieldUpdateOperationsInput | string | null
    convertedOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomRequestCreateManyInput = {
    id?: string
    userId: string
    productCategory: string
    description: string
    referenceImages?: JsonNullValueInput | InputJsonValue
    budgetRange: string
    status?: string
    adminQuotePrice?: number | null
    adminQuoteEta?: string | null
    adminQuoteNotes?: string | null
    convertedOrderId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CustomRequestUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    productCategory?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    referenceImages?: JsonNullValueInput | InputJsonValue
    budgetRange?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    adminQuotePrice?: NullableFloatFieldUpdateOperationsInput | number | null
    adminQuoteEta?: NullableStringFieldUpdateOperationsInput | string | null
    adminQuoteNotes?: NullableStringFieldUpdateOperationsInput | string | null
    convertedOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CustomRequestUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    productCategory?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    referenceImages?: JsonNullValueInput | InputJsonValue
    budgetRange?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    adminQuotePrice?: NullableFloatFieldUpdateOperationsInput | number | null
    adminQuoteEta?: NullableStringFieldUpdateOperationsInput | string | null
    adminQuoteNotes?: NullableStringFieldUpdateOperationsInput | string | null
    convertedOrderId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type CustomRequestCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productCategory?: SortOrder
    description?: SortOrder
    referenceImages?: SortOrder
    budgetRange?: SortOrder
    status?: SortOrder
    adminQuotePrice?: SortOrder
    adminQuoteEta?: SortOrder
    adminQuoteNotes?: SortOrder
    convertedOrderId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomRequestAvgOrderByAggregateInput = {
    adminQuotePrice?: SortOrder
  }

  export type CustomRequestMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productCategory?: SortOrder
    description?: SortOrder
    budgetRange?: SortOrder
    status?: SortOrder
    adminQuotePrice?: SortOrder
    adminQuoteEta?: SortOrder
    adminQuoteNotes?: SortOrder
    convertedOrderId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomRequestMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    productCategory?: SortOrder
    description?: SortOrder
    budgetRange?: SortOrder
    status?: SortOrder
    adminQuotePrice?: SortOrder
    adminQuoteEta?: SortOrder
    adminQuoteNotes?: SortOrder
    convertedOrderId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CustomRequestSumOrderByAggregateInput = {
    adminQuotePrice?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use CustomRequestDefaultArgs instead
     */
    export type CustomRequestArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = CustomRequestDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}