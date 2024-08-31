import { IApi } from "@app/interfaces"
import { respSuccess } from "@app/utility/helpers"
import { singleton } from "tsyringe"
import { IRootApi } from "../schemas/sample.schema"

/**
 * Service to handle Ads related operations.
 */
@singleton()
export default class SampleService {

  public getRootData: IApi<IRootApi['fastify']> = async (req, reply) => {
    return respSuccess(reply, { total: 200 })
  }
}
