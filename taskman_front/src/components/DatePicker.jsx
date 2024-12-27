import React from 'react';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '@heroicons/react/24/outline';

const DatePicker = ({ selected, onChange, className, minDate, required, ...props }) => {
  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div className="relative">
      <input
        type="text"
        value={value}
        onClick={onClick}
        ref={ref}
        readOnly
        className={`${className} cursor-pointer pr-10`}
        required={required}
      />
      <CalendarIcon 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 
                   text-gray-400 dark:text-gray-500 pointer-events-none" 
      />
    </div>
  ));

  return (
    <ReactDatePicker
      selected={selected}
      onChange={onChange}
      customInput={<CustomInput />}
      dateFormat="MMM dd, yyyy"
      minDate={minDate}
      required={required}
      {...props}
      className={`${className} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
      calendarClassName="dark:bg-gray-800 dark:text-white dark:border-gray-700"
      dayClassName={date => 
        `dark:hover:bg-gray-700 ${
          date.getDate() === selected?.getDate() && 
          date.getMonth() === selected?.getMonth() 
            ? 'dark:bg-indigo-600 dark:text-white'
            : 'dark:text-gray-300'
        }`
      }
      monthClassName={() => 'dark:text-gray-300'}
      weekDayClassName={() => 'dark:text-gray-400'}
    />
  );
};

export default DatePicker; 