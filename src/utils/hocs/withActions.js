import React, { PureComponent } from 'react'

const DEFAULT_OPTIONS = {
    shouldForwardAction: false,
}

const withActions = ({ actionHandlers = {}, initialState = {}, options = DEFAULT_OPTIONS }) =>
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

                return result
            }

            render() {
                return <WrappedComponent {...this.props} {...this.state} onAction={this.handleAction} />
            }
        }

        return WithActions
    }

export default withActions
