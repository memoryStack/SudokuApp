export type UserDetails = {
    id: string
}

export type UserDetailsAdapter = {
    getUserId: () => Promise<UserDetails['id']>
}
