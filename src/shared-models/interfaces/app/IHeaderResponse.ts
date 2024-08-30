import { ICoverModel, ILogoModel } from './index.js'

export interface IHeaderResponse {
  covers: ICoverModel[]
  logo: ILogoModel | null
}
