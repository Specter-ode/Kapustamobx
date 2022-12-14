import { Button, ButtonTransactions } from './Button';
import s from './ExpensesAndIncome.module.css';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import Calendar from 'components/Calendar/Calendar';
import Summary from '../Summary/Summary';
import TransactionDetails from '../TransactionDetails/TransactionDetails';
import { ReactComponent as BackArrow } from 'assets/svg/back-arrow.svg';
import { ReactComponent as Calculator } from 'assets/svg/calculator.svg';
import useWindowDimensions from 'helpers/hooks/windowDimension';
import { observer } from 'mobx-react-lite';
import { transactionStore, authStore } from 'mobxStores/stores';

const ExpensesAndIncome = ({ date, setDate }) => {
  const params = useParams();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const {
    expenseCategories,
    incomeCategories,
    addExpense,
    addIncome,
    changeIncomeMonthStats,
    changeExpenseMonthStats,
  } = transactionStore;
  const { addExpenseMob, addIncomeMob } = authStore;
  const location = useLocation();
  let currentDate = date.toJSON().slice(0, 10);

  const handleChange = e => {
    const { name, value } = e.target;
    switch (name) {
      case 'description':
        setDescription(value);
        break;
      case 'price':
        setPrice(value);
        break;
      case 'category':
        setCategory(value);
        break;
      default:
        return;
    }
  };
  const buttonStatus =
    description.length > 0 &&
    price.length > 0 &&
    category.length > 0 &&
    category !== 'Product category';

  const handleSubmit = e => {
    e.preventDefault();
    const month = date.toLocaleString('ru-Ru', { year: 'numeric', month: 'long' }).split(' ')[0];
    const monthToCheck = month.charAt(0).toUpperCase() + month.slice(1);

    if (!buttonStatus) {
      toast.error('Fill in all the fields');
      return;
    }
    const transactionObject = {
      description,
      amount: Number(price),
      date: currentDate,
      category,
    };

    if (location.pathname === '/transactions/expenses') {
      if (window.innerWidth > 767) {
        addExpense(transactionObject);
        changeExpenseMonthStats(monthToCheck, Number(price));
      } else {
        addExpenseMob(transactionObject);
      }
    } else {
      if (window.innerWidth > 767) {
        addIncome(transactionObject);
        changeIncomeMonthStats(monthToCheck, Number(price));
      } else {
        addIncomeMob(transactionObject);
      }
    }
    setDescription('');
    setCategory('');
    setPrice('');
  };

  const handleReset = e => {
    e.preventDefault();
    setDescription('');
    setCategory('');
    setPrice('');
  };
  const { width } = useWindowDimensions();

  return (
    <>
      {Boolean(width > 768) && <ButtonTransactions />}
      <div className={s.container}>
        <div className={s.block}>
          <div className={s.thumbs}>
            <NavLink to="/" className={s.icon_back}>
              <BackArrow className={s.backArrow} />
            </NavLink>
            <Calendar date={date} setDate={setDate} />
            <form className={s.form}>
              <div className={s.blok_input}>
                <input
                  className={s.input}
                  name="description"
                  value={description}
                  type="text"
                  onChange={handleChange}
                  placeholder="Product description"
                />
                <select
                  className={s.select}
                  placeholder="Product category"
                  name="category"
                  value={category}
                  autoComplete="off"
                  autoCorrect="off"
                  onChange={handleChange}
                >
                  <option defaultValue>Product category</option>
                  {location.pathname === '/transactions/expenses'
                    ? expenseCategories &&
                      expenseCategories.map(item => (
                        <option value={item} key={item}>
                          {item}
                        </option>
                      ))
                    : incomeCategories &&
                      incomeCategories.map(item => (
                        <option value={item} key={item}>
                          {item}
                        </option>
                      ))}
                </select>
                <div className={s.wrapper_input_cal}>
                  <input
                    className={s.price}
                    name="price"
                    value={price}
                    placeholder="00.00"
                    onChange={handleChange}
                  />
                  <div className={s.background_icon}>
                    <Calculator className={s.icon_cal} />
                  </div>
                  <Calculator className={s.icon_second_cal} />
                </div>
              </div>
              <div className={s.wrapper_button}>
                <Button
                  className={s.btn}
                  type="submit"
                  onClickSubmit={handleSubmit}
                  onClickReset={handleReset}
                ></Button>
              </div>
            </form>
          </div>
          <TransactionDetails />
        </div>
        <Summary params={params} />
      </div>
    </>
  );
};

export default observer(ExpensesAndIncome);
