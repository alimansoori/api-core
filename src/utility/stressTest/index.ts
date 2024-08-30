export {}
// import 'reflect-metadata';
// import { logger } from '@app/lib/logger.js';
// import { StressTest } from '@app/utility/stressTest/fakes/StressTest.js';
// import { isProduction } from '../helpers/index.js';
// const { /* createFakeMeeting */ createFakeUsers, /* createFakeWorkspace */ createFakeUclDocument } =
//   new StressTest();

// if (isProduction()) {
//   logger.error(new Error('you can`t run stress test on production environment'));
//   process.exit(130);
// }

// const RunTests = async () => {
//   logger.info('starting stress test for data base ...');

//   await createFakeUsers(1000).then((time) => {
//     logger.info(`creating users is done. creation time: ${time} ms`);
//   });

//   /*   await createFakeWorkspace(1000).then((time) => {
//     logger.info(`creating workspaces is done. creation time: ${time} ms`);
//   }); */

//   // await createFakeMeeting(1000).then((time) => {
//   //   logger.info(`creating meetings is done. creation time: ${time} ms`);
//   // });

//   await createFakeUclDocument(1000).then((time) => {
//     logger.info(`creating ucl document is done. creation time: ${time} ms`);
//   });
// };

// RunTests().then(() => {
//   logger.info('finished!');
//   process.exit(0);
// });
