import s from './MonthTotal.module.css';
import { InfinitySpin } from 'react-loader-spinner';
import { observer } from 'mobx-react-lite';
import { transactionStore } from 'mobxStores/stores';

const MonthTotalStatistics = () => {
  const { loading, periodData } = transactionStore;
  const incomeTotal = periodData.incomes?.incomeTotal;
  const expenseTotal = periodData.expenses?.expenseTotal;
  const expenseNormalizer =
    expenseTotal === 0
      ? expenseTotal?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') + ' грн.'
      : '- ' + expenseTotal?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') + ' грн.';

  const incomeNormalizer =
    incomeTotal === 0
      ? incomeTotal?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') + ' грн.'
      : '+ ' + incomeTotal?.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') + ' грн.';

  return (
    <ul className={s.list}>
      <li className={s.item}>
        {loading ? (
          <>
            <p className={s.textLoading}>Expenses:</p>
            <div className={s.spinner}>
              <InfinitySpin width="70" color="#3f51b5" />
            </div>
          </>
        ) : (
          <>
            <p className={s.text}>Expenses:</p>
            <span className={s.expense}>{expenseNormalizer}</span>
          </>
        )}
      </li>
      <li className={s.item}>
        {loading ? (
          <>
            <p className={s.textLoading}>Income:</p>
            <div className={s.spinner}>
              <InfinitySpin width="70" color="#3f51b5" />
            </div>
          </>
        ) : (
          <>
            <p className={s.text}>Income:</p>
            <span className={s.income}>{incomeNormalizer}</span>
          </>
        )}
      </li>
    </ul>
  );
};

export default observer(MonthTotalStatistics);
