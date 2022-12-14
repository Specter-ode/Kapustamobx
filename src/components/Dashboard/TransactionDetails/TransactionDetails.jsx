import { ConfirmActionModal } from 'components/Modal/QuestionModal';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { transactionStore } from 'mobxStores/stores';
import s from './TransactionDetails.module.css';

const TransactionDetails = () => {
  const [modal, setModal] = useState(false);
  const [transactionOnDeleteId, setTransactionOnDeleteId] = useState('');
  const location = useLocation();
  const { deleteTransaction, income, expense, changeExpenseMonthStats, changeIncomeMonthStats } =
    transactionStore;
  let transactions = location.pathname === '/transactions/expenses' ? expense : income;

  const handleDeleteTransaction = async id => {
    setModal(false);
    try {
      await deleteTransaction(id);
      if (location.pathname === '/transactions/expenses') {
        const res = expense.find(el => el._id === id);
        const month = new Date(res.date)
          .toLocaleString('ru-Ru', { year: 'numeric', month: 'long' })
          .split(' ')[0];
        const normalizeMonth = month.charAt(0).toUpperCase() + month.slice(1);
        changeExpenseMonthStats(normalizeMonth, -res.amount);
      } else {
        const res = income.find(el => el._id === id);
        const month = new Date(res.date)
          .toLocaleString('ru-Ru', { year: 'numeric', month: 'long' })
          .split(' ')[0];
        const normalizeMonth = month.charAt(0).toUpperCase() + month.slice(1);
        changeIncomeMonthStats(normalizeMonth, -res.amount);
      }
    } catch (error) {
      return error.message;
    }
  };
  const onDelete = id => {
    setModal(true);
    setTransactionOnDeleteId(id);
  };

  const normalize = amount => {
    if (location.pathname === '/transactions/expenses') {
      const amountNormalizer =
        '- ' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') + ' грн.';
      return amountNormalizer;
    } else {
      const amountNormalizer =
        '+ ' + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') + ' грн.';
      return amountNormalizer;
    }
  };
  const summStyle = location.pathname === '/transactions/expenses' ? s.minus : s.plus;

  return (
    <>
      <div className={s.scrollTable}>
        <table>
          <thead className={s.tableHead}>
            <tr>
              <th className={s.table__head__empty}></th>
              <th className={s.table__head__date}>DATE</th>
              <th className={s.table__head__text}>DESCRIPTION</th>
              <th className={s.table__head__category}>CATEGORY</th>
              <th className={s.table__head__sum}>SUM</th>
              <th className={s.table__head__delete}></th>
            </tr>
          </thead>
        </table>
        <div className={s.scrollTableBody}>
          <table>
            <tbody>
              {transactions
                ?.map(({ date, description, category, amount, _id }) => {
                  const normalizeDate = new Date(date).toLocaleDateString('en-GB');
                  return (
                    <tr className={s.body} key={_id}>
                      <td className={s.body__empty}></td>
                      <td className={s.body__date}>{normalizeDate}</td>
                      <td className={s.body__description}>{description}</td>
                      <td className={s.body__category}>{category}</td>
                      <td className={summStyle}>{normalize(amount)}</td>
                      <td className={s.body__delete}>
                        <button
                          onClick={() => onDelete(_id)}
                          type="button"
                          className={s.btnDelete}
                        ></button>
                      </td>
                    </tr>
                  );
                })
                ?.reverse()}
            </tbody>
          </table>
        </div>
        {modal && (
          <ConfirmActionModal
            title="Are you sure?"
            onClickYes={() => handleDeleteTransaction(transactionOnDeleteId)}
            onClickNo={() => setModal(false)}
          />
        )}
      </div>
    </>
  );
};
export default observer(TransactionDetails);
