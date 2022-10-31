import { useCallback, useEffect, useState } from "react";
import { Drawer, Row, Col } from "antd";
import useSound from "use-sound";

import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getTransactionsTop } from "../../redux/types/Transactions";
import { hideMessage } from "../../redux/types/Message";
import { formatNumber } from "../../utils";

import testImg from "../../assets/images/Dubai.jpg";
import sound from "../../assets/sounds/fanfary.mp3";
import "./style.scss";

const CongratulationBlock = () => {
  const dispatch = useAppDispatch();
  const { message, settings } = useAppSelector((state) => state);
  const [play, { stop, duration }] = useSound(sound);
  const [timeoutClose, setTimeoutClose] = useState<any>(null);

  // const showDrawerClick = () => {
  //   dispatch(showMessage());
  // };

  const onClose = () => {
    dispatch(hideMessage());
    settings && dispatch(getTransactionsTop(settings));
    stop();
  };

  const drawerClose = () => {
    onClose();
  };

  const playMusic = useCallback(() => {
    if (message.active && message.isNewMessage) {
      play();
      if (duration) {
        setTimeoutClose(
          setTimeout(() => {
            onClose();
          }, duration)
        );
      }
    } else if (!message.active && timeoutClose) {
      clearTimeout(timeoutClose);
      setTimeoutClose(null);
    }
  }, [message, play]);

  useEffect(() => playMusic(), [playMusic]);

  return (
    <>
      {/* <LayoutBlock>
        <Button type="primary" onClick={showDrawerClick}>
          Показать блок
        </Button>
      </LayoutBlock> */}

      <Drawer
        placement="right"
        width="100%"
        onClose={drawerClose}
        open={message.active}
        className="drawer-message-block"
      >
        <Row className="message-block">
          <Col span={10}>
            <div className="message-block_img">
              <img
                src={
                  message.employee_photo
                    ? `/images/${message.employee_photo}`
                    : testImg
                }
                alt="test"
              />
            </div>
          </Col>
          <Col span={14}>
            <div className="message-block_content">
              <div className="message-block_content_text">
                <h1 className="message-block_content__title">Поздравляем</h1>
                <h2 className="message-block_content__subtitle">
                  {message.employee_name}
                </h2>

                <p className="message-block_content__txt">
                  Сделка прошла успешно!
                </p>
              </div>

              <div className="message-block_content__results">
                <div className="block-result block-result__project">
                  {message.project_name}
                </div>

                <div className="block-result block-result__value">
                  {message.transaction_value &&
                    message.currency &&
                    formatNumber(message.transaction_value, message.currency)}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default CongratulationBlock;
