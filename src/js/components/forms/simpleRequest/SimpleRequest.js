/* TODO: Remove eslint-disable */
/* eslint-disable */
import React, { Component } from 'react';
import {
    FormGroup, InputGroup, Button, ButtonGroup, TextArea
} from '@blueprintjs/core';
import { getStorage, setStorage } from '../../../utils/storage';
import { func, string } from 'prop-types';

import './simpleRequest.less';

export default class SimpleRequest extends Component {
    static propTypes = {
        action: func,
        onClose: func,
        reasonLabel: string
    };

    static defaultProps = {
        action: null,
        onClose: null,
        reasonLabel: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            errors: {},
            firstName: getStorage('name')?.firstName || '',
            lastName: getStorage('name')?.lastName || ''
        }
    }

    handleChange = (key, val) => this.setState({[key]: val});

    validator = () => {
        const { reasonLabel } = this.props;
        const { firstName, lastName, reason } = this.state;
        const errors = {};

        if (!firstName) errors.firstName = true;
        if (!lastName) errors.lastName = true;
        if (reasonLabel && !reason) errors.reason = true;

        if (Object.keys(errors).length !== 0) {
            const errorMsg = "Please correct the following fields.";

            if (errors.firstName || errors.lastName) errors.msg = errorMsg;
            if (errors.reason) errors.reasonMsg = errorMsg;

            this.setState({ errors });
        } else {
            return true;
        }
    }

    handleAction = (event) => {
        const { action } = this.props;
        const { firstName, lastName, reason } = this.state;
        const isValidated = this.validator();

        if (isValidated) {
            setStorage('name', {firstName, lastName});
            action({ firstName, lastName, reason });
        }
    }

    render() {
        const { onClose, reasonLabel } = this.props;
        const { errors, firstName, lastName, reason } = this.state;

        return (
            <div className="event-approval-container">
                <FormGroup
                    labelInfo="(required)"
                    label="First and Last Name"
                    labelFor="name-input"
                    intent={errors?.msg ? 'danger' : 'none'}
                    helperText={errors?.msg}
                    className="wrapper"
                >
                    <InputGroup
                        className="event-input"
                        placeholder="First Name"
                        value={firstName}
                        intent={errors?.firstName ? 'danger' : 'none'}
                        onChange={() => this.handleChange('firstName', event.target.value)}
                    />
                    <InputGroup
                        className="event-input"
                        placeholder="Last Name"
                        value={lastName}
                        intent={errors?.lastName ? 'danger' : 'none'}
                        onChange={() => this.handleChange('lastName', event.target.value)}
                    />
                </FormGroup>
                {reasonLabel && (
                    <FormGroup
                        label={reasonLabel}
                        helperText={errors?.reasonMsg}
                        intent={errors?.reasonMsg ? 'danger' : 'none'}
                    >
                        <TextArea
                            growVertically={true}
                            large={true}
                            onChange={() => this.handleChange('reason', event.target.value)}
                            intent={errors?.reason ? 'danger' : 'none'}
                            value={reason}
                            style={{width: '100%'}}
                        />
                    </FormGroup>
                )}
                <ButtonGroup>
                    <Button
                        text={reasonLabel ? 'Request Removal' : 'Approve'}
                        intent="success"
                        large
                        onClick={this.handleAction}
                    />
                    <Button
                        text="Cancel"
                        large
                        onClick={onClose}
                    />
                </ButtonGroup>
            </div>
        );
    }
}
