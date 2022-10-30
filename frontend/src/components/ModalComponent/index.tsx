import React from "react";
import { Modal, ModalProps } from "antd";

interface IModalComponent extends ModalProps {
  topModal?: boolean;
  noPadding?: boolean;
  children?: React.ReactNode;
}

const ModalComponent = ({
  open,
  title,
  width,
  confirmLoading,
  topModal,
  centered,
  onCancel,
  noPadding,
  closable,
  children,
}: IModalComponent) => (
  <Modal
    title={title}
    open={open}
    confirmLoading={confirmLoading || false}
    onCancel={onCancel}
    width={width || 520}
    style={{ top: topModal ? 20 : centered ? 0 : 100 }}
    closable={closable}
    footer={null}
    bodyStyle={{
      padding: noPadding ? 0 : 24,
    }}
    centered={centered || false}
    className="app-modal"
  >
    <div className="modal-content-wrapper">{children}</div>
  </Modal>
);

export default ModalComponent;
