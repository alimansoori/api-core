import { ICustomReply } from '@app/interfaces/IFastifyCustomReplyTypeForRc.js'
import { MultipartFile } from '@fastify/multipart'
import { HTTP_METHOD } from '@prisma/client'
import tsyringe from 'tsyringe'
import { IEnvironment } from '../environment/environment.js'
import { TestContext } from '@app/utility/helpers/testHelpers/interfaces/index.js'

declare module 'tsyringe' {
  // target property's type is not compatible with TS5, so we're overwriting it with any.
  declare function inject(
    token: tsyringe.InjectionToken<any>,
  ): (target: any, propertyKey: string | symbol | undefined, parameterIndex: number) => any
}

declare module 'fastify' {
  interface FastifyRequest {
    user: import('@app/shared-models').IUserTokenGet
    client: {
      client_id: string
    }
    project: import('@app/shared-models').IGetProjectByDomainResp
    workspace: import('@app/shared-models').IWorkspaceWithProject
    dataFromMiddleware
    uploadedFiles?: MultipartFile
  }

  interface RequestBodyDefault {
    files: any
  }

  interface FastifyReply extends ICustomReply {
    _bulk?: {
      isInProgress: boolean
      result: {
        status: HTTP_STATUS
        body: Record<string, any>
      }[]
    }
    client: {
      client_id: string
      method: HTTP_METHOD
      description: string
      origin: string
      related?: string
      ip_address: string
    }
  }
}

declare global {
  namespace NodeJS {
    interface Process {
      browser: boolean
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends IEnvironment {}
  }

  namespace Mocha {
    // there is problem with 'before' functions in spec files when strict is true in tsconfig file.
    interface HookFunction {
      (fn: (this: TestContext) => PromiseLike<any>): void
    }
  }

  // ----------------------------------------  Utilities  ----------------------------------------

  /**
   * Awaited return type of function.
   */
  type AwaitedReturn<T> = Awaited<ReturnType<T>>
}

export {}
