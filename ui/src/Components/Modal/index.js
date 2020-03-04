import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import { observer } from "mobx-react";
import { observable } from "mobx";

import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";

import { Keyboard, KeyCombo } from "@reasonink/clack-react";

import {
  MountModal,
  MountModalBackdrop
} from "Components/Animations/MountModal";

const Modal = observer(
  class Modal extends Component {
    static propTypes = {
      size: PropTypes.oneOf(["lg", "xl"]),
      isOpen: PropTypes.bool.isRequired,
      isUpper: PropTypes.bool,
      toggleOpen: PropTypes.func.isRequired,
      children: PropTypes.node.isRequired
    };
    static defaultProps = {
      size: "lg",
      isUpper: false
    };

    constructor(props) {
      super(props);
      this.modalRef = React.createRef();
      this.lastIsOpen = observable.box(false);
    }

    toggleBodyClass = isOpen => {
      document.body.classList.toggle("modal-open", isOpen);
      if (isOpen) {
        this.modalRef.current.focus();
        disableBodyScroll(this.modalRef.current);
      } else {
        clearAllBodyScrollLocks();
      }
      this.lastIsOpen.set(isOpen);
    };

    componentDidMount() {
      const { isOpen } = this.props;
      if (isOpen) {
        this.toggleBodyClass(isOpen);
      }
    }

    componentDidUpdate() {
      const { isOpen } = this.props;
      // we shouldn't update if modal is hidden and was hidden previously
      // which can happen when the button gets re-rendered
      if (this.lastIsOpen.get() === true || isOpen === true) {
        this.toggleBodyClass(isOpen);
      }
    }

    componentWillUnmount() {
      const { isOpen } = this.props;

      if (isOpen) {
        this.toggleBodyClass(false);
      }
    }

    render() {
      const {
        size,
        isOpen,
        isUpper,
        toggleOpen,
        children,
        ...props
      } = this.props;

      return ReactDOM.createPortal(
        <React.Fragment>
          <MountModal
            in={isOpen}
            unmountOnExit
            className="modal-open"
            {...props}
          >
            <div>
              <Keyboard>
                <KeyCombo c="esc" onPress={toggleOpen} />
                <div
                  ref={this.modalRef}
                  className="modal d-block"
                  role="dialog"
                  tabIndex={-1}
                >
                  <div
                    className={`modal-dialog modal-${size} ${isUpper &&
                      "modal-upper shadow"}`}
                    role="document"
                  >
                    <div className="modal-content">{children}</div>
                  </div>
                </div>
              </Keyboard>
            </div>
          </MountModal>
          <MountModalBackdrop in={isOpen} unmountOnExit>
            <div className="modal-backdrop d-block" />
          </MountModalBackdrop>
        </React.Fragment>,
        document.body
      );
    }
  }
);

export { Modal };
