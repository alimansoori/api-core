import { getRepo } from '@app/database/entities/repositoryRegistry.js'
import { getConfigs } from '@app/lib/config.validator.js'
import { nanoid } from 'nanoid'

export const seedWorkspaceTask = async () => {
  const repo = getRepo()
  const { API_BACKEND_IP } = getConfigs()
  let server_id: number | undefined

  if (API_BACKEND_IP === '95.111.214.79') {
    server_id = 2
  } else if (API_BACKEND_IP === '94.237.57.101') {
    server_id = 3
  } else if (API_BACKEND_IP === '95.111.217.192') {
    server_id = 4
  } else if (API_BACKEND_IP === '94.237.75.231') {
    server_id = 5
  }

  if (server_id) {
    const workspaces = await repo.workspace.getWorkspacesForTask(server_id)

    for (const workspace of workspaces) {
      if (!workspace.task_type.length) {
        await repo.task.createTaskType({
          task_type_hash: nanoid(31),
          title: 'Task',
          workspace_id: workspace.workspace_id,
        })
      }
    }
  }

  const plans = await repo.billing.getAllPlans(1)

  const taskModule = await repo.module.getModuleByKey('task')

  if (!taskModule) {
    // eslint-disable-next-line no-console
    console.log(' ================== task module not found')
  }

  for (const plan of plans) {
    if (!plan.plan_module.length) {
      await repo.billing.createPlanModule({
        plan_id: plan.plan_id,
        module_id: taskModule.module_id,
      })
    }
  }

  const usertypes = await repo.usertype.getUsertypesByProjectID(1)

  for (const usertype of usertypes) {
    if (!usertype.usertype_module.length) {
      await repo.usertype.addUserTypeModule({
        module_id: taskModule.module_id,
        usertype_id: usertype.usertype_id,
      })
    }
  }
}
