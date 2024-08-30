import { PrismaClient } from '@prisma/client'

type IgnorePrismaBuiltin<S> = string extends S ? string : S extends '' ? S : S extends `$${infer T}` ? never : S

export type PrismaModelsName = IgnorePrismaBuiltin<keyof PrismaClient>
