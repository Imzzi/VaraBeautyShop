// @ts-ignore
import serverModule from '../dist-server/server.cjs';

const app = (serverModule as any)?.default || serverModule;

export default app;


