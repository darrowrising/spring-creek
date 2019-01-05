/* TODO: Remove eslint-disable */
/* eslint-disable */
import React, { Component } from 'react';
import {
    FormGroup, InputGroup, Button, ButtonGroup
} from '@blueprintjs/core';
import { getStorage, setStorage } from '../../utils/storage';
import { func } from 'prop-types';

import './eventApproval.less';

export default class EventApproval extends Component {
    static propTypes = {
        approved: func,
        onClose: func
    };

    static defaultProps = {
        approved: null,
        onClose: null
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

    handleApprove = () => {
        const { approved } = this.props;
        const { firstName, lastName } = this.state;
        setStorage('name', {firstName, lastName});
        approved(firstName, lastName);
    }

    render() {
        const { onClose } = this.props;
        const { errors, firstName, lastName } = this.state;

        return (
            <div className="event-approval-container">
                <FormGroup
                    labelInfo="(required)"
                    label="First and Last Name"
                    labelFor="name-input"
                    intent={errors?.title ? 'danger' : 'none'}
                    helperText={errors?.title}
                    className="wrapper"
                >
                    <InputGroup
                        className="event-input"
                        placeholder="First Name"
                        value={firstName}
                        intent={errors?.title ? 'danger' : 'none'}
                        onChange={() => this.handleChange('firstName', event.target.value)}
                    />
                    <InputGroup
                        className="event-input"
                        placeholder="Last Name"
                        value={lastName}
                        intent={errors?.title ? 'danger' : 'none'}
                        onChange={() => this.handleChange('lastName', event.target.value)}
                    />
                </FormGroup>
                <ButtonGroup>
                    <Button
                        text="Approve"
                        intent="success"
                        large
                        onClick={this.handleApprove}
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
