import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer, Button, Row, Col } from "antd";
import useSound from "use-sound";

import LayoutBlock from "../../components/LayoutBlock";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { hideMessage, showMessage } from "../../redux/types/Message";
import { formatNumber } from "../../utils";

import testImg from "../../assets/images/Dubai.jpg";
import sound from "../../assets/sounds/fanfary.mp3";
import "./style.scss";

const CongratulationPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { message } = useAppSelector((state) => state);
  const [play, { stop, duration }] = useSound(sound);

  const showDrawerClick = () => {
    dispatch(showMessage());
  };

  const onClose = () => {
    dispatch(hideMessage());
    stop();
  };

  const playMusic = useCallback(() => {
    if (message.active && message.isNewMessage) {
      play();
      duration &&
        setTimeout(() => {
          onClose();
          navigate("/", { replace: true });
        }, duration);
    }
  }, [message, play]);

  useEffect(() => playMusic(), [playMusic]);

  return (
    <div className="page page-padding">
      <LayoutBlock>
        <Button type="primary" onClick={showDrawerClick}>
          Показать блок
        </Button>
      </LayoutBlock>

      <Drawer
        placement="right"
        width="100%"
        onClose={onClose}
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
    </div>
  );
};

export default CongratulationPage;
