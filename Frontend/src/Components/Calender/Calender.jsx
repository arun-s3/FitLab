import React from 'react'
import './Calender.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css';

import { format } from 'date-fns'; 

const MyContainer = ({ className, children }) => {
    return (
      <div style={{ padding: "16px", background: "#216ba5", color: "#fff" }}>
        <CalendarContainer className={className}>
          <div style={{ background: "#f0f0f0" }}>
            What is your favorite day?
          </div>
          <div style={{ position: "relative" }}>{children}</div>
        </CalendarContainer>
      </div>
    );
  };

const CalenderIcon = ()=>{
    return(
      // <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-days"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-search"><path d="M16 2v4"/><path d="M21 11.75V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.25"/><path d="m22 22-1.875-1.875"/><path d="M3 10h18"/><path d="M8 2v4"/><circle cx="18" cy="18" r="3"/></svg>
    )
}

export function DateSelector({dateGetter, dateSetter, labelNeeded}){

    const {startDate, endDate} = dateGetter
    const {setStartDate, setEndDate} = dateSetter
    return(
           <div id="calender" className='flex gap-[5px] items-center'>
                <div className="date-picker">
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} selectsStart startDate={startDate} endDate={endDate}
                        placeholderText="Select start date" dateFormat="yyyy/MM/dd" showIcon icon={<CalenderIcon/>} />
                </div>
                
                { labelNeeded && <span className='text-[13px] text-secondary font-[450]'> To </span> }

                <div className="date-picker">
                    <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} selectsEnd startDate={startDate} endDate={endDate}
                        minDate={startDate} placeholderText="Select end date" dateFormat="yyyy/MM/dd" showIcon icon={<CalenderIcon/>} />
                </div>
            </div>
    )
}