
export const appSettings = {
    unGuardedRoutes: [
        "/auth0/callback",
        '/login',
        '/public/discovery',
        /^\/public\/discovery\/[^/]+$/,
        /^\/profile\/[^/]+$/,
        /^\/invitation\/[^/]+\/[^/]+$/,
    ],
    defaultLimit: 10,
    baseUrl: '',
    toastDuration: 3000
}