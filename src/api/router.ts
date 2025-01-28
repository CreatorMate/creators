import type {Endpoint} from "~/src/api/utils/Endpoint";
import type {Controller} from "~/src/api/utils/Controller";
import type {Hono} from "hono";


export function initializeHonoRouter(app: Hono) {
    const controllers: Controller[] = [
    ];

    const endpoints: Endpoint[] = [
    ];

    for(const controller of controllers) {
        controller.endpoints();
    }

    for(const endpoint of endpoints) {
        endpoint.register(app);
    }
}

