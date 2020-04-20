import React, { Component } from "react";
import PropTypes from "prop-types";

import { observer } from "mobx-react";
import { observable, action } from "mobx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons/faSpinner";

import { AlertStore } from "Stores/AlertStore";
import { TooltipWrapper } from "Components/TooltipWrapper";
import { Flash } from "Components/Animations/Flash";
import { Modal } from "Components/Modal";

// https://github.com/facebook/react/issues/14603
const OverviewModalContent = React.lazy(() =>
  import("./OverviewModalContent").then((module) => ({
    default: module.OverviewModalContent,
  }))
);

const OverviewModal = observer(
  class OverviewModal extends Component {
    static propTypes = {
      alertStore: PropTypes.instanceOf(AlertStore).isRequired,
    };

    toggle = observable(
      {
        show: false,
        toggle() {
          this.show = !this.show;
        },
        hide() {
          this.show = false;
        },
      },
      { toggle: action.bound, hide: action.bound }
    );

    render() {
      const { alertStore } = this.props;

      return (
        <React.Fragment>
          <TooltipWrapper title="Show alert overview">
            <Flash spyOn={alertStore.info.totalAlerts}>
              <div
                className={`text-center d-inline-block cursor-pointer navbar-brand m-0 components-navbar-button  ${
                  this.toggle.show ? "border-info" : ""
                }`}
                onClick={this.toggle.toggle}
              >
                {alertStore.info.totalAlerts}
              </div>
            </Flash>
          </TooltipWrapper>
          <Modal
            size="xl"
            isOpen={this.toggle.show}
            toggleOpen={this.toggle.toggle}
          >
            <React.Suspense
              fallback={
                <h1 className="display-1 text-placeholder p-5 m-auto">
                  <FontAwesomeIcon icon={faSpinner} size="lg" spin />
                </h1>
              }
            >
              <OverviewModalContent
                alertStore={alertStore}
                onHide={this.toggle.hide}
                isVisible={this.toggle.show}
              />
            </React.Suspense>
          </Modal>
        </React.Fragment>
      );
    }
  }
);

export { OverviewModal };
