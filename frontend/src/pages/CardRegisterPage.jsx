import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const CardRegisterPage = () => {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCVV] = useState("");
  const [submitText, setSubmitText] = useState("Submit");
  const [isFormValid, setIsFormValid] = useState(false);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(e.target.value);
  };

  const handleExpiryMonthChange = (e) => {
    setExpiryMonth(e.target.value);
  };

  const handleExpiryYearChange = (e) => {
    setExpiryYear(e.target.value);
  };

  const handleCVVChange = (e) => {
    setCVV(e.target.value);
  };
  const validateForm = () => {
    let cardNumberTmp = cardNumber;
    cardNumberTmp = cardNumberTmp.replace(/\s/g, "");

    const isNameValid = name.trim() !== "";
    const isCardNumberValid = /^\d{16}$/.test(cardNumberTmp);
    const isExpiryMonthValid = /^\d{2}$/.test(expiryMonth);
    const isExpiryYearValid = /^\d{2}$/.test(expiryYear);
    const isCVVValid = /^\d{3}$/.test(cvv);

    if (!isNameValid) {
      toast.error("Invalid Name");
    } else if (!isCardNumberValid) {
      toast.error("Invalid Card Number");
    } else if (!isExpiryMonthValid || !isExpiryYearValid) {
      toast.error("Invalid Expiry Date");
    } else if (!isCVVValid) {
      toast.error("Invalid CVV");
    }
    return (
      isNameValid &&
      isCardNumberValid &&
      isExpiryMonthValid &&
      isExpiryYearValid &&
      isCVVValid
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid) {
      setIsFormValid(true);
      setSubmitText("Valid");
    } else {
      setIsFormValid(false);
      setSubmitText("Submit");
    }
  };

  useEffect(() => {
    setIsFormValid(false);
    setSubmitText("Submit");
  }, [name, cardNumber, expiryMonth, expiryYear, cvv]);

  return (
    <div className="card-register-page">
      <h2>Credit Card Information</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name"
            minLength="2"
          />
        </label>
        <label>
          Card Number:
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            onInput={(e) => {
              const inputValue = e.currentTarget.value.replace(/[^\d]/g, "");
              const formattedValue = inputValue
                .slice(0, 16)
                .replace(/(\d{4})(?=\d)/g, "$1 ");
              e.currentTarget.value = formattedValue;
            }}
            placeholder="Enter 16 card digits"
            maxLength="19"
            minLength="19"
          />
        </label>
        <label>
          Expiry Date:
          <div className="expiry-date">
            <input
              type="text"
              value={expiryMonth}
              onChange={handleExpiryMonthChange}
              onInput={(e) =>
                (e.currentTarget.value = e.currentTarget.value
                  .replace(/[^\d]/g, "")
                  .slice(0, 2))
              }
              placeholder="MM"
              maxLength="2"
              minLength="2"
            />
            <input
              type="text"
              value={expiryYear}
              onChange={handleExpiryYearChange}
              onInput={(e) =>
                (e.currentTarget.value = e.currentTarget.value
                  .replace(/[^\d]/g, "")
                  .slice(0, 2))
              }
              placeholder="YY"
              maxLength="2"
              minLength="2"
            />
          </div>
        </label>
        <label>
          CVV:
          <input
            type="text"
            value={cvv}
            onChange={handleCVVChange}
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value
                .replace(/[^\d]/g, "")
                .slice(0, 3))
            }
            placeholder="Enter CVV"
            maxLength="3"
            minLength="3"
          />
        </label>
        <button type="submit">{submitText}</button>
      </form>
      <Link to="/register">
        <button disabled={!isFormValid}>Continue</button>
      </Link>
    </div>
  );
};

export default CardRegisterPage;
