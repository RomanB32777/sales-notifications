import { Card, Col, Row } from "antd";
import { useCallback, useEffect } from "react";
import { Flipper, Flipped } from "react-flip-toolkit";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getTransactionsTop } from "../../redux/types/Transactions";
import { formatNumber } from "../../utils";
import { ISettings, ITopList } from "../../types";

// import testImg from "../../assets/images/Dubai.jpg";

import "./style.scss";

const MainPage = () => {
  const dispatch = useAppDispatch();
  const { transactions, settings } = useAppSelector((state) => state);
  const { transactions_top } = transactions;

  const getLevelEmployees = (level: keyof ITopList) =>
    transactions_top[level].map(
      ({ id, employee_name, employee_photo, sum_transactions }) => (
        <Flipped key={id} flipId={id}>
          <Col span={4}>
            <Card
              className="employee-card"
              title={
                <h4 className="employee-text employee-sum">
                  {settings?.currency &&
                    formatNumber(sum_transactions, settings.currency)}
                </h4>
              }
              cover={
                <img
                  alt={employee_name}
                  style={{ width: "100%", height: 260, objectFit: "cover" }}
                  src={`/images/${employee_photo}`} // testImg
                />
              }
              // style={{ width: 260 }}
              bordered={false}
            >
              <h3 className="employee-text employee-name">
                {employee_name.split(" ")[0]}
              </h3>
            </Card>
          </Col>
        </Flipped>
      )
    );

  const getLevelDescription = useCallback((): {
    [key in keyof ITopList]: string;
  } => {
    return {
      top_level: `level top - sum >= ${settings?.top_level}`,
      middle_level: `level middle - sum >= ${settings?.middle_level} and sum < ${settings?.top_level}`,
      low_level: `level low - sum < ${settings?.middle_level}`,
    };
  }, [settings]);

  useEffect(() => {
    settings?.id && dispatch(getTransactionsTop(settings));
  }, [settings]);

  return (
    <div className="page">
      <div className="main-page">
        {transactions_top && (
          <Flipper
            flipKey={Object.keys(transactions_top).map((key) =>
              transactions_top[key as keyof ITopList]
                .map(({ id }) => id)
                .join("")
            )}
          >
            {Object.keys(transactions_top).map((key) => {
              const keyOfTopList = key as keyof ITopList;
              return (
                <Row key={key}>
                  <Col span={4}>
                    <div className="level-description">
                      <p>{getLevelDescription()[keyOfTopList]}</p>
                    </div>
                  </Col>
                  <Col span={20}>
                    <Row
                      justify="center"
                      key={key}
                      gutter={[16, 16]}
                      className="level-employees"
                    >
                      {getLevelEmployees(key as keyof ITopList)}
                    </Row>
                  </Col>
                </Row>
              );
            })}
          </Flipper>
        )}
      </div>
    </div>
  );
};

export default MainPage;
