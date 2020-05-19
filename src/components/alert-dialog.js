import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default class AlertDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={() => this.handleClose()}
            />,
            <FlatButton
                label="Confirm"
                primary={true}
                onTouchTap={() => {
                    this.props.handleConfirm();
                    this.handleClose();
                }}
            />,
        ];

        return (
            <div>
                <Dialog
                    actions={actions}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    {this.props.message}
                </Dialog>
            </div>
        );
    }
}