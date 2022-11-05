import { Card, Col, Row } from "antd";
import { useCallback, useEffect } from "react";
import { Flipper, Flipped } from "react-flip-toolkit";

import Collage, { ICollageImage } from "../../components/Collage";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { getTransactionsTop } from "../../redux/types/Transactions";
import { formatNumber } from "../../utils";
import { IEmployee, ITopList } from "../../types";

// import testImg from "../../assets/images/Dubai.jpg";
import "./style.scss";

interface IFlippedCard extends IEmployee {
  employee_photos?: ICollageImage[];
  sum_transactions?: number;
}

const FlippedCard = ({
  id,
  employee_name,
  employee_photo,
  employee_photos,
  sum_transactions,
}: IFlippedCard) => {
  const { settings } = useAppSelector((state) => state);
  return (
    <Flipped flipId={id}>
      <Col span={4}>
        <Card
          className="employee-card"
          title={
            <h4 className="employee-text employee-sum">
              {settings?.currency &&
                sum_transactions &&
                formatNumber(sum_transactions, settings.currency)}
            </h4>
          }
          cover={
            employee_photos ? (
              <Collage images={employee_photos} />
            ) : (
              <img
                alt={employee_name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src={`/images/${employee_photo}`}
              />
            )
          }
          bordered={false}
        >
          <h3 className="employee-text employee-name">{employee_name}</h3>
        </Card>
      </Col>
    </Flipped>
  );
};

const MainPage = () => {
  const dispatch = useAppDispatch();
  const { transactions, settings } = useAppSelector((state) => state);
  const { transactions_top } = transactions;

  const getLevelEmployees = (level: keyof ITopList) =>
    transactions_top[level].map(({ employees, sum_transactions }) => {
      if (employees.length === 1)
        return (
          <FlippedCard
            {...employees[0]}
            key={employees[0].id}
            employee_name={employees[0].employee_name.split(" ")[0]}
            sum_transactions={sum_transactions}
          />
        );

      const cooperativeEmployeesName = employees
        .map(({ employee_name }) => employee_name.split(" ")[0])
        .join("/");

      const cooperativeEmployeesId = +employees.map(({ id }) => id).join("");

      const cooperativeEmployeesImages: ICollageImage[] = employees.map(
        ({ employee_photo, employee_name, id }) => ({
          src: `/images/${employee_photo}`, // testImg
          alt: employee_name,
          key: id,
        })
      );

      return (
        <FlippedCard
          key={cooperativeEmployeesId}
          id={cooperativeEmployeesId}
          employee_name={cooperativeEmployeesName}
          employee_photos={cooperativeEmployeesImages}
          employee_photo={""}
          sum_transactions={sum_transactions}
        />
      );
    });

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
            PROFESSIONALS <span className="emoji">💪</span>
          </h3>
          <p
            dangerouslySetInnerHTML={{
              __html: settings
                ? `Total price of project ${
                    settings.middle_level
                  } &mdash; ${formatNumber(
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
            SPECIALISTS <span className="emoji">🙏</span>
          </h3>
          <p>
            Total price of project {"< "}
            {settings && formatNumber(settings.middle_level, settings.currency)}
          </p>
        </>
      ),
      zero_level: (
        <>
          <h3>
            GREY ZONE <span className="emoji">0️⃣</span>
          </h3>
          <p>
            Total price of project =
            {settings && formatNumber(0, settings.currency)}
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
        <Flipper
          flipKey={Object.keys(transactions_top)
            .map((key) =>
              transactions_top[key as keyof ITopList].length
                ? transactions_top[key as keyof ITopList]
                    .map(({ employees }) => employees.map((e) => e.id))
                    .join("")
                : ""
            )
            .join("")}
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
                  <div className="level-employees">
                    <Row justify="center" key={key} gutter={[16, 16]}>
                      {getLevelEmployees(key as keyof ITopList)}
                    </Row>
                  </div>
                </Col>
              </Row>
            );
          })}
        </Flipper>
      </div>
    </div>
  );
};

export default MainPage;
