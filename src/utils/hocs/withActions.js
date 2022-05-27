import React, { PureComponent } from 'react'

const DEFAULT_ON_ACTION_PROP_NAME = 'onAction'
const DEFAULT_OPTIONS = {
    shouldForwardAction: false,
}

const withActions = ({ actionHandlers = {}, onActionPropAlias = DEFAULT_ON_ACTION_PROP_NAME, initialState = {}, options = DEFAULT_OPTIONS }) =>
    function wrapComponent(WrappedComponent) {
        class WithActions extends PureComponent {
            state = initialState

            getState = () => ({ ...this.props, ...this.state })

            handleAction = (action = {}) => {
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

                const test = 'zzz'

                return result
            }

            getOnActionProp = () => {
                return {
                    [onActionPropAlias]: this.handleAction
                }
            }

            render() {
                return (
                    <WrappedComponent
                        {...this.props}
                        {...this.state}
                        {...this.getOnActionProp()}
                    />
                )
            }
        }

        return WithActions
    }

export default withActions
