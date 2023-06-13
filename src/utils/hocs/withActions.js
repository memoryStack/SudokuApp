import React, { PureComponent } from 'react'

const DEFAULT_ON_ACTION_PROP_NAME = 'onAction'
const DEFAULT_OPTIONS = {
    shouldForwardAction: false,
}

const withActions = ({ actionHandlers = {}, initialState = {}, options = DEFAULT_OPTIONS }) => {
    // TODO: is doing this transform fine ??
    //      looks wrong that a variable can be object and also array
    let actionHandlersConfig = actionHandlers
    if (!Array.isArray(actionHandlers)) {
        actionHandlersConfig = [{ actionHandlers }]
    }

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

            getOnActionProp = () => actionHandlersConfig.reduce(
                (prev, { onActionPropAlias = DEFAULT_ON_ACTION_PROP_NAME, actionHandlers }) => {
                    prev[onActionPropAlias] = action => this.handleAction(action, actionHandlers)
                    return prev
                },
                {},
            )

            render() {
                return <WrappedComponent {...this.state} {...this.onActions} {...this.props} />
            }
        }

        return WithActions
    }
}

export default withActions
