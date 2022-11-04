import { useCallback, useEffect, useState } from "react";
import { Drawer, Row, Col } from "antd";
import useSound from "use-sound";

import Collage from "../Collage";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { getTransactionsTop } from "../../redux/types/Transactions";
import { hideMessage } from "../../redux/types/Message";
import { formatNumber } from "../../utils";

import sound from "../../assets/sounds/fanfary.mp3";
import "./style.scss";

const CongratulationBlock = () => {
  const dispatch = useAppDispatch();
  const { message, settings } = useAppSelector((state) => state);
  const {
    project_name,
    transaction_value,
    currency,
    employees,
    active,
    isNewMessage,
  } = message;

  const [play, { stop, duration }] = useSound(sound);
  const [timeoutClose, setTimeoutClose] = useState<any>(null);

  const onClose = () => {
    dispatch(hideMessage());
    settings && dispatch(getTransactionsTop(settings));
    stop();
  };

  const drawerClose = () => {
    onClose();
  };

  const playMusic = useCallback(() => {
    if (active && isNewMessage) {
      play();
      if (duration) {
        setTimeoutClose(
          setTimeout(() => {
            onClose();
          }, duration)
        );
      }
    } else if (!active && timeoutClose) {
      clearTimeout(timeoutClose);
      setTimeoutClose(null);
    }
  }, [message, play]);

  useEffect(() => playMusic(), [playMusic]);

  return (
    <>
      <Drawer
        placement="right"
        width="100%"
        onClose={drawerClose}
        open={active}
        className="drawer-message-block"
      >
        <Row className="message-block">
          <Col span={10}>
            <div className="message-block_img">
              <Collage
                images={employees.map(
                  ({ employee_name, employee_photo, id }) => ({
                    src: `/images/${employee_photo}`, 
                    alt: employee_name,
                    key: id,
                  })
                )}
              />
            </div>
          </Col>
          <Col span={14}>
            <div className="message-block_content">
              <div className="message-block_content_text">
                <h1 className="message-block_content__title">Поздравляем</h1>
                <h2 className="message-block_content__subtitle">
                  {employees
                    .map(({ employee_name }) => employee_name)
                    .join("/")}
                </h2>

                <p className="message-block_content__txt">
                  Сделка прошла успешно!
                </p>
              </div>

              <div className="message-block_content__results">
                <div className="block-result block-result__project">
                  {project_name}
                </div>

                <div className="block-result block-result__value">
                  {transaction_value &&
                    currency &&
                    formatNumber(transaction_value, currency)}
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
