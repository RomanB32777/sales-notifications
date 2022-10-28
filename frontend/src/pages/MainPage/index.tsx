import { useCallback, useEffect, useState } from "react";
import { Drawer, Button, Row, Col } from "antd";
import { Flipper, Flipped } from "react-flip-toolkit";
import useSound from "use-sound";

import LayoutBlock from "../../components/LayoutBlock";
import TableComponent from "../../components/TableComponent";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { hideMessage, showMessage } from "../../redux/types/Message";
import { getTransactions } from "../../redux/types/Transactions";
import { IPeriodItemsTypes } from "../../utils/dateMethods/types";
import { formatNumber, getFilterSettings } from "../../utils";
import { IFilterSettings, ITransactionTopList } from "../../types";
import { tableColumns } from "./tableData";

import testImg from "../../assets/images/Dubai.jpg";
import sound from "../../assets/sounds/fanfary.mp3";
import "./style.scss";
import { init_filter_settings } from "../../consts";

const FlippedRow: React.FC<any> = ({ ...restProps }) => (
  <Flipped key={restProps["data-row-key"]} flipId={restProps["data-row-key"]}>
    <tr {...restProps} />
  </Flipped>
);

const MainPage = () => {
  const dispatch = useAppDispatch();
  const { message, transactions, loading } = useAppSelector((state) => state);
  const [play, { stop, duration }] = useSound(sound);
  const [transactionsRender, setTransactionsRender] = useState<
    ITransactionTopList[]
  >([]);

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
        }, duration);
    }
  }, [message, play]);

  useEffect(() => playMusic(), [playMusic]);

  useEffect(() => {
    if (transactions.length) {
      const forTableData = transactions.map((employee, key) => ({
        ...employee,
        key,
      }));
      setTransactionsRender(forTableData as ITransactionTopList[]);
    }
  }, [transactions]);

  useEffect(() => {
    const settings: IFilterSettings = getFilterSettings();
    dispatch(getTransactions(settings));
  }, []);

  return (
    <div className="page">
      <LayoutBlock>
        <Flipper flipKey="top-employees">
          <TableComponent
            loading={loading}
            dataSource={transactionsRender}
            columns={tableColumns}
            components={{
              body: {
                row: FlippedRow,
              },
            }}
            pagination={false}
          />
        </Flipper>
      </LayoutBlock>

      <LayoutBlock>
        <Button type="primary" onClick={showDrawerClick}>
          Показать блок
        </Button>
      </LayoutBlock>

      <Drawer
        placement="right"
        width="100%"
        onClose={onClose}
        visible={message.active}
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

export default MainPage;

//
//    <Flipper flipKey={testList.join("test")}>
//   <List
//     className="employees-top-list"
//     loading={loading}
//     itemLayout="horizontal"
//     dataSource={transactionsRender}
//     pagination={{
//       total: transactionsRender.length,
//       pageSize: 5,
//       hideOnSinglePage: true,
//     }}
//     renderItem={({ id, employee_name, employee_photo }) => (
//       <Flipped key={id} flipId={id}>
//         <List.Item
//           style={{ display: "flex" }}
//           actions={[
//             <Button type="primary" danger>
//               test
//             </Button>,
//           ]}
//         >
//           <List.Item.Meta
//             avatar={<Avatar size={100} src={employee_photo} />}
//             title={employee_name}
//           />
//         </List.Item>
//       </Flipped>
//     )}
//   ></List>
// </Flipper>;

// {
//   Boolean(transactions.length) && (
//     <>
//       <Row>
//         {tableColumns.map(({ title, dataIndex }) => (
//           <Col key={dataIndex}>{title}</Col>
//         ))}
//       </Row>
//       <Flipper flipKey="test">
//         {(transactions as ITransactionTopList[]).map(
//           ({ employee_name, employee_photo, sum_transactions, id }) => (
//             <Flipped key={id} flipId={id}>
//               <Row>
//                 <Col>
//                   {id} ----
//                   <img
//                     width={272}
//                     alt={employee_name}
//                     src={`/images/${employee_photo}`}
//                   />
//                 </Col>
//                 <Col>{employee_name}</Col>
//                 <Col>{sum_transactions}</Col>
//               </Row>
//             </Flipped>
//           )
//         )}
//       </Flipper>
//     </>
//   );
// }
//
