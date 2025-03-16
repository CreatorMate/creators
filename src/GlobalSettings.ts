
export const appSettings = {
    unGuardedRoutes: [
        "/auth0/callback",
        '/login',
        /^\/invitation\/[^/]+\/[^/]+$/,
    ],
    defaultLimit: 10,
    baseUrl: '',
    toastDuration: 3000
}