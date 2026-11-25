import { handleSchedule } from '@vercel/schedules';
// @ts-ignore
import fxSyncModule from '../../dist-server/fx-sync.cjs';

const { syncFxRatesToDb } = (fxSyncModule as any)?.default || fxSyncModule;

export const POST = handleSchedule(async (metadata) => {
  const result = await syncFxRatesToDb({ trigger: 'schedule', force: false });
  console.log(
    `[schedule:${metadata.name}] execution=${metadata.executionId} updated=${result.updated} skipped=${result.skippedReason ?? 'none'} source=${result.source ?? 'n/a'} usd=${result.config?.usdRate} aed=${result.config?.aedRate}`
  );
});
