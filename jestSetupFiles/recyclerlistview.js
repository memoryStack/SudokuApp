jest.mock('recyclerlistview', () => ({
    ...jest.requireActual('recyclerlistview'),
    RecyclerListView: ({ dataProvider, layoutProvider, rowRenderer }) => {
        const data = dataProvider.getAllData()
        return data.map((datum, index) => rowRenderer(layoutProvider.getLayoutTypeForIndex(index), datum))
    },
}))
