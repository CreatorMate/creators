import type {Endpoint} from "~/src/api/utils/Endpoint";
import type {Controller} from "~/src/api/utils/Controller";
import type {Hono} from "hono";
import {CreatorsController} from "~/src/api/modules/creators/CreatorsController";
import {GetSelfEndpoint} from "~/src/api/modules/creators/GetSelf/GetSelfEndpoint";
import {UpdateCreatorEndpoint} from "~/src/api/modules/creators/UpdateCreator/UpdateCreatorEndpoint";


export function initializeHonoRouter(app: Hono) {
    const controllers: Controller[] = [
        new CreatorsController(app)
    ];

    const endpoints: Endpoint[] = [
        new GetSelfEndpoint(),
        new UpdateCreatorEndpoint()
    ];

    for(const controller of controllers) {
        controller.endpoints();
    }

    for(const endpoint of endpoints) {
        endpoint.register(app);
    }
}

