/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from "prop-types";
import { FaStar } from "react-icons/fa";

const StarRating = ({ count, value, onChange }) => {
  const [hover, setHover] = useState(null);

  return (
    <div>
      {[...Array(count)].map((star, index) => {
        var ratingValue = (index + 1) * 1;
        return (
          <label key={index}>
            <input
              type="radio"
              name="rating"
              style={{ display: "none" }}
              value={ratingValue}
              onClick={() => onChange(ratingValue)}
            />
            <FaStar
              size={30}
              color={ratingValue <= (hover || value) ? "#ffc107" : "#e4e5e9"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
              style={{
                marginRight: 10,
                cursor: "pointer",
              }}
            />
          </label>
        );
      })}
    </div>
  );
};

StarRating.propTypes = {
  count: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default StarRating;
