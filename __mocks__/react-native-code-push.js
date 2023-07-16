// TODO: this commented mock didn't work
// jest.mock('react-native-code-push', () => {
//     const cp = _ => app => app
//     Object.assign(cp, {
//         InstallMode: { ON_NEXT_RESTART: 'ON_APP_RESTART' },
//         CheckFrequency: {},
//         SyncStatus: {},
//         UpdateState: {},
//         DeploymentStatus: {},
//         DEFAULT_UPDATE_DIALOG: {},

//         checkForUpdate: jest.fn(),
//         codePushify: jest.fn(),
//         getConfiguration: jest.fn(),
//         getCurrentPackage: jest.fn(),
//         getUpdateMetadata: jest.fn(),
//         log: jest.fn(),
//         notifyAppReady: jest.fn(),
//         notifyApplicationReady: jest.fn(),
//         sync: jest.fn(),
//     })
//     return cp
// })

const codePush = {
    InstallMode: { ON_NEXT_RESTART: 'ON_APP_RESTART' },
    CheckFrequency: { ON_APP_START: 'ON_APP_START' },
}
const cb = () => app => app
Object.assign(cb, codePush)
export default cb
