import { useRoute } from '@react-navigation/native';

// TODO: is it possible to write test-cases for this hook ??
export const useScreenName = () => {
    const route = useRoute()
    return route.name
}
