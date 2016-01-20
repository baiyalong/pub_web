/**
 * Created by bai on 2015/8/20.
 */
//��ʱ����


for (var s in scheduleJobs) {
  SyncedCron.add({
    name: s,
    schedule: scheduleJobs[s].schedule,
    job: scheduleJobs[s].job
  });
}

if(!ENV_INTERFACE){
SyncedCron.start();
}
