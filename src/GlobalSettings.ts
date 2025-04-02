
export const appSettings = {
    unGuardedRoutes: [
        "/auth0/callback",
        '/login',
        '/public/discovery',
        /^\/public\/discovery\/[^/]+$/,
        /^\/invitation\/[^/]+\/[^/]+$/,
    ],
    defaultLimit: 10,
    baseUrl: '',
    toastDuration: 3000
}