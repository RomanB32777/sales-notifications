import { Card, Col, Row } from "antd";
import { useCallback, useEffect } from "react";
import { Flipper, Flipped } from "react-flip-toolkit";

import CongratulationBlock from "../../components/congratulationBlock";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getTransactionsTop } from "../../redux/types/Transactions";
import { formatNumber } from "../../utils";
import { ITopList } from "../../types";

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
    [key in keyof ITopList]: React.ReactNode;
  } => {
    return {
      top_level: (
        <>
          <h3>
            CHAMPIONS <span className="emoji">🏆</span>
          </h3>
          <p>
            Total price of project ≥
            {settings && formatNumber(settings.top_level, settings.currency)}
          </p>
        </>
      ),
      middle_level: (
        <>
          <h3>
            PROFESSIONALS <span className="emoji">💪🏼</span>
          </h3>
          <p
            dangerouslySetInnerHTML={{
              __html: settings
                ? `Total price of project ${settings.middle_level} &mdash; ${formatNumber(
                    settings.top_level,
                    settings.currency
                  )}`
                : "",
            }}
          ></p>
        </>
      ),
      low_level: (
        <>
          <h3>
            LOW LEVEL <span className="emoji">👎🏼</span>
          </h3>
          <p>
            Total price of project {"< "}
            {settings && formatNumber(settings.middle_level, settings.currency)}
          </p>
        </>
      ),
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
                  <Col span={5}>
                    <div className="level-description">
                      <div>{getLevelDescription()[keyOfTopList]}</div>
                    </div>
                  </Col>
                  <Col span={19}>
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
      <CongratulationBlock />
    </div>
  );
};

export default MainPage;
