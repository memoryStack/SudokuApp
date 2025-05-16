type UserFamiliarWithHints = {
    userId: string
}

export interface ArenaServiceAdapterInterface {
    getUserFamiliarWithHints: (data: UserFamiliarWithHints) => Promise<boolean>
}
