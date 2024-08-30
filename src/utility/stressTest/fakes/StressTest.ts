import 'reflect-metadata'
import bcrypt from 'bcrypt'
import { logger } from '@app/lib/logger.js'
import os from 'os'
import { USER_ROLE, Prisma, user } from '@prisma/client'
import { generateNanoID } from '@app/utility/helpers/index.js'
import { randEmail, randFirstName, randLastName, randPassword, randPhoneNumber } from '@ngneat/falso'
import { IDummyPerson } from '@app/shared-models/index.js'
import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { getHelper } from '@app/utility/helpers/globalHelper/globalHelper.js'
export class StressTest {
  promises: Promise<any>[]
  usersId: number[]
  meetingsId: string[]
  uclDocumentsId: number[]
  workspacesId: number[]
  constructor() {
    this.promises = []
    this.usersId = []
    this.meetingsId = []
    this.uclDocumentsId = []
    this.workspacesId = []
  }

  /// ////////////////////////////////// user ///////////////////////////////////////
  createFakeUsers = async (count: number) => {
    const date = Date.now()
    const repo = getRepo()
    const helper = getHelper()

    for (let i = 0; i < count; i++) {
      const dummy = <IDummyPerson>{
        email: randEmail(),
        password: randPassword(),
        first_name: randFirstName(),
        last_name: randLastName(),
        phone: randPhoneNumber(),
        country_id: 'us',
        language_id: 'de',
      }
      const user: Prisma.userCreateArgs['data'] = {
        user_identity: {
          create: { value: dummy.email, is_primary: true, is_verified: true, type: 'email', console_project_id: 1 },
        },
        usertype_id: 1,
        console_project_language_id: 1,
        user_hash: generateNanoID(),
        password: await bcrypt.hash(dummy.password, 10),
        first_name: dummy.first_name,
        last_name: dummy.last_name,
        role: USER_ROLE.user,
        console_project_id: 1,
        username: '',
      }
      user.username = await helper.auth.generateRandomUsername(`${user.first_name}${user.last_name}`)
      const createdUser = repo.user
        .createUser(user)
        .then(this._successHandler('user', i, this.usersId, 'user_id'))
        .catch(this._errorHandle('user', i))
      this.promises.push(createdUser)

      if (!(i % os.cpus().length)) {
        await this._streamData()
      }
    }

    return Date.now() - date
  }

  /// ////////////////////////////////// workspace ///////////////////////////////////////

  /*   createFakeWorkspace = async (count: number) => {
    const date = Date.now();

    for (let i = 0; i < count; i++) {
      const userIndex = Math.floor(Math.random() * this.usersId.length);
      const userId = this.usersId[userIndex];
      const dummy = dummyWorkSpace(userId);
      const workspace = workspaceRepository
        .addWorkspace(dummy)
        .then(this._successHandler('workspace', i, this.workspacesId, 'workspace_id'))
        .catch(this._errorHandle('workspace', i));
      this.promises.push(workspace);

      if (!(i % os.cpus().length)) {
        await this._streamData();
      }
    }

    return Date.now() - date;
  }; */

  /// ////////////////////////////////// meeting ///////////////////////////////////////

  // createFakeMeeting = async (count: number) => {
  //   const date = Date.now();

  //   for (let i = 0; i < count; i++) {
  //     const index = Math.floor(Math.random() * this.usersId.length);
  //     const userId = this.usersId[index];

  //     const workspaceIndex = Math.floor(Math.random() * this.meetingsId.length);
  //     const workspaceId = this.workspacesId[workspaceIndex];

  //     const dummy = dummyMeeting(userId, workspaceId);
  //     const meeting = meetingRepository
  //       .createMeeting(dummy)
  //       .then(this._successHandler('meeting', i, this.meetingsId, 'meeting_id'))
  //       .catch(this._errorHandle('meeting', i));
  //     this.promises.push(meeting);

  //     if (!(i % os.cpus().length)) {
  //       await this._streamData();
  //     }
  //   }

  //   return Date.now() - date;
  // };

  /// ////////////////////////////////// ucl document ///////////////////////////////////////

  // createFakeUclDocument = async (count: number) => {
  // const date = Date.now();

  // // const documentRepository = container.resolve(DocumentRepository);

  // for (let i = 0; i < count; i++) {
  //   // const userIndex = Math.floor(Math.random() * this.usersId.length);
  //   // const userId = this.usersId[userIndex];

  //   // const meetingIndex = Math.floor(Math.random() * this.meetingsId.length);
  //   // const meetingId = this.meetingsId[meetingIndex];

  //   // const workspaceIndex = Math.floor(Math.random() * this.meetingsId.length);
  //   // const workspaceId = this.workspacesId[workspaceIndex];

  //   // const dummy = dummyUclDocument(userId, workspaceId, meetingId);

  //   // const uclDocument = documentRepository
  //   //   .create(dummy)
  //   //   .then(this._successHandler('ucl document', i, this.uclDocumentsId, 'document_id'))
  //   //   .catch(this._errorHandle('ucl document', i));
  //   // this.promises.push(uclDocument);

  //   if (!(i % os.cpus().length)) {
  //     await this._streamData();
  //   }
  // }

  // return Date.now() - date;
  // };

  /// ////////////////////////////////////// private function /////////////////////////////////////////////
  private _streamData = async () => {
    await Promise.allSettled(this.promises)
    this.promises = []
  }

  private _errorHandle = (model: string, counter: number) => (err: Error) => {
    logger.warning(`${model} ${counter + 1} creation is failed`)
    logger.error(err)
  }

  private _successHandler =
    (model: string, counter: number, idCollector: (number | string)[], idFieldName: 'user_id') => (data: user) => {
      idCollector.push(data[idFieldName])
      logger.info(`${model} ${counter + 1}  is created`)
    }
}
