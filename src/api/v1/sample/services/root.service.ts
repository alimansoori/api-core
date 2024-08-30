import { IApi } from "@app/interfaces"
import { respSuccess } from "@app/utility/helpers"
import { singleton } from "tsyringe"
import { IRootApi } from "../schemas/root.schema"

/**
 * Service to handle Ads related operations.
 */
@singleton()
export default class RootService {

  public getRootData: IApi<IRootApi['fastify']> = async (req, reply) => {
    return respSuccess(reply, { total: 200 })
  }
}
