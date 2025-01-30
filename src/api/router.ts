import type {Endpoint} from "~/src/api/utils/Endpoint";
import type {Controller} from "~/src/api/utils/Controller";
import type {Hono} from "hono";
import {CreatorsController} from "~/src/api/modules/creators/CreatorsController";
import {GetSelfEndpoint} from "~/src/api/modules/creators/GetSelf/GetSelfEndpoint";
import {UpdateCreatorEndpoint} from "~/src/api/modules/creators/UpdateCreator/UpdateCreatorEndpoint";
import {GetConnectionEndpoint} from "~/src/api/modules/phyllo/GetConnection/GetConnectionEndpoint";
import {AddAccountEndpoint} from "~/src/api/modules/accounts/AddAccount/AddAccountEndpoint";
import {DeleteAccountEndpoint} from "~/src/api/modules/accounts/DeleteAccount/DeleteAccountEndpoint";
import {GetCreatorBrandsEndpoint} from "~/src/api/modules/creators/GetCreatorBrands/GetCreatorBrandsEndpoint";
import {UpdateCreatorBrandsEndpoint} from "~/src/api/modules/creators/UpdateCreatorBrands/UpdateCreatorBrandsEndpoint";


export function initializeHonoRouter(app: Hono) {
    const controllers: Controller[] = [
        new CreatorsController(app)
    ];

    const endpoints: Endpoint[] = [
        new GetSelfEndpoint(),
        new UpdateCreatorEndpoint(),
        new GetConnectionEndpoint(),
        new AddAccountEndpoint(),
        new DeleteAccountEndpoint(),
        new GetCreatorBrandsEndpoint(),
        new UpdateCreatorBrandsEndpoint(),
    ];

    for(const controller of controllers) {
        controller.endpoints();
    }

    for(const endpoint of endpoints) {
        endpoint.register(app);
    }
}

