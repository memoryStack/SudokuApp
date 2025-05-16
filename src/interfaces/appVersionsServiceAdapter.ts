type AppUpdateInfo = {
    features: string[]
    mandatory: boolean
}

export interface AppVersionsServiceAdapter {
    getAppUpdate: () => Promise<AppUpdateInfo>
}
