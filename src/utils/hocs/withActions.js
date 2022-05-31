import React, { PureComponent } from 'react'

const DEFAULT_ON_ACTION_PROP_NAME = 'onAction'
const DEFAULT_OPTIONS = {
    shouldForwardAction: false,
}

// TODO: add arguments type here for ease of use
const withActions = ({ actionHandlers = {}, initialState = {}, options = DEFAULT_OPTIONS }) => {
    return function wrapComponent(WrappedComponent) {
        class WithActions extends PureComponent {
            state = initialState

            constructor(props) {
                super(props)

                this.onActions = this.getOnActionProp()
            }

            getState = () => ({ ...this.props, ...this.state })

            handleAction = (action = {}, actionHandlers) => {
                const handler = actionHandlers[action.type]
                const { onAction, shouldForwardAction } = this.props

                let result

                if (handler) {
                    result = handler({
                        params: action.payload,
                        getState: this.getState,
                        setState: this.setState.bind(this),
                    })
                }

                if (options.shouldForwardAction || shouldForwardAction) {
                    result = onAction(action, result)
                }

                return result
            }

            // TODO: "actionHandlers" is gettin confusing right now. MUST refactore it
            getOnActionProp = () => {
                if (Array.isArray(actionHandlers)) {
                    return actionHandlers.reduce((prev, { onActionPropAlias = DEFAULT_ON_ACTION_PROP_NAME, actionHandlers }) => {
                        prev[onActionPropAlias] = (action) => this.handleAction(action, actionHandlers)
                        return prev
                    }, {})
                }

                return {
                    [DEFAULT_ON_ACTION_PROP_NAME]: (action) => this.handleAction(action, actionHandlers)
                }
            }

            render() {
                return (
                    <WrappedComponent
                        {...this.props}
                        {...this.state}
                        {...this.onActions}
                    />
                )
            }
        }

        return WithActions
    }
}

export default withActions
