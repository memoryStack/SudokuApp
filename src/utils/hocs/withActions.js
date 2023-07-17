import React, { PureComponent } from 'react'

const DEFAULT_ON_ACTION_PROP_NAME = 'onAction'
const DEFAULT_OPTIONS = {
    shouldForwardAction: false,
}

const withActions = ({ actionHandlers: actionHandlersArg = {}, initialState = {}, options = DEFAULT_OPTIONS }) => {
    const actionHandlersConfig = Array.isArray(actionHandlersArg) ? actionHandlersArg
        : [{ actionHandlers: actionHandlersArg }]

    return function wrapComponent(WrappedComponent) {
        class WithActions extends PureComponent {
            constructor(props) {
                super(props)

                this.onActions = this.getOnActionProp()
                this.unmounting = false
                this.state = initialState
            }

            componentWillUnmount() {
                this.unmounting = true
            }

            getState = () => ({ ...this.props, ...this.state, unmounting: this.unmounting })

            handleAction = (action, actionHandlers) => {
                const handler = actionHandlers[action.type]

                let result

                if (handler) {
                    result = handler({
                        params: action.payload,
                        getState: this.getState,
                        setState: this.setState.bind(this),
                    })
                }

                // eslint-disable-next-line react/prop-types
                const { onAction: parentOnAction, shouldForwardAction } = this.props
                if (options.shouldForwardAction || shouldForwardAction) {
                    result = parentOnAction(action, result)
                }

                return result
            }

            getOnActionProp = () => actionHandlersConfig.reduce((prev, actionHandlerConfig) => {
                const { onActionPropAlias = DEFAULT_ON_ACTION_PROP_NAME, actionHandlers } = actionHandlerConfig
                prev[onActionPropAlias] = action => this.handleAction(action, actionHandlers)
                return prev
            }, {})

            render() {
                return <WrappedComponent {...this.state} {...this.onActions} {...this.props} />
            }
        }

        return WithActions
    }
}

export default withActions
