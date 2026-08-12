"use strict";

/*
==================================================
MOTORCYCLE RENTAL CALCULATOR
==================================================

Default daily motorcycle rate:
₱50

The application saves information in the browser
using localStorage.

==================================================
*/


/* ================================================
   SETTINGS
================================================ */

const STORAGE_KEY = "motorcycle_rental_data";

const DEFAULT_RATE = 50;


/* ================================================
   STATE
================================================ */

let currentDate = new Date();

let selectedDates = [];

let extraCharges = [];


/* ================================================
   GET HTML ELEMENTS
================================================ */

const calendar =
    document.getElementById("calendar");

const monthYear =
    document.getElementById("monthYear");

const previousMonth =
    document.getElementById("previousMonth");

const nextMonth =
    document.getElementById("nextMonth");

const dailyRate =
    document.getElementById("dailyRate");

const customerName =
    document.getElementById("customerName");

const chargesContainer =
    document.getElementById("charges");

const addCharge =
    document.getElementById("addCharge");

const daysUsed =
    document.getElementById("daysUsed");

const rentalTotal =
    document.getElementById("rentalTotal");

const extraTotal =
    document.getElementById("extraTotal");

const grandTotal =
    document.getElementById("grandTotal");

const selectedDatesContainer =
    document.getElementById("selectedDates");

const todayButton =
    document.getElementById("todayButton");

const printButton =
    document.getElementById("printButton");

const clearButton =
    document.getElementById("clearButton");

const saveMessage =
    document.getElementById("saveMessage");


/* ================================================
   FORMAT MONEY
================================================ */

function formatMoney(amount) {

    return "₱" + Number(amount).toLocaleString(
        "en-PH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


/* ================================================
   CREATE DATE KEY
================================================ */

function createDateKey(year, month, day) {

    return (
        year +
        "-" +
        String(month + 1).padStart(2, "0") +
        "-" +
        String(day).padStart(2, "0")
    );

}


/* ================================================
   GET TODAY KEY
================================================ */

function getTodayKey() {

    const today = new Date();

    return createDateKey(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

}


/* ================================================
   RENDER CALENDAR
================================================ */

function renderCalendar() {

    calendar.innerHTML = "";


    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const monthName =
        currentDate.toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );


    monthYear.textContent =
        monthName;


    /*
    First day of the month.
    Sunday = 0
    Monday = 1
    ...
    Saturday = 6
    */

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    /*
    Number of days in this month.
    */

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /*
    Add empty spaces before
    the first day.
    */

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const empty =
            document.createElement("div");

        empty.className =
            "day empty";

        calendar.appendChild(empty);

    }


    /*
    Create each day.
    */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const key =
            createDateKey(
                year,
                month,
                day
            );


        const dayElement =
            document.createElement("div");


        dayElement.className =
            "day";


        /*
        Is this date selected?
        */

        const isSelected =
            selectedDates.includes(key);


        if (isSelected) {

            dayElement.classList.add(
                "selected"
            );

        }


        /*
        Is this today?
        */

        if (key === getTodayKey()) {

            dayElement.classList.add(
                "today"
            );

        }


        /*
        Build the day.
        */

        dayElement.innerHTML = `

            <span class="day-number">
                ${day}
            </span>

            <span class="day-price">
                ₱${getDailyRate()}
            </span>

            ${
                isSelected
                    ? '<span class="check">✓</span>'
                    : ''
            }

        `;


        /*
        Click day.
        */

        dayElement.addEventListener(
            "click",
            function () {

                toggleDate(key);

            }
        );


        calendar.appendChild(
            dayElement
        );

    }

}


/* ================================================
   TOGGLE DATE
================================================ */

function toggleDate(key) {

    const index =
        selectedDates.indexOf(key);


    if (index !== -1) {

        /*
        Date is already selected.
        Remove it.
        */

        selectedDates.splice(
            index,
            1
        );

    } else {

        /*
        Date isn't selected.
        Add it.
        */

        selectedDates.push(key);

    }


    /*
    Keep dates organized.
    */

    selectedDates.sort();


    saveData();

    renderCalendar();

    calculateTotal();

}


/* ================================================
   GET DAILY RATE
================================================ */

function getDailyRate() {

    const value =
        Number(dailyRate.value);


    if (
        !Number.isFinite(value) ||
        value < 0
    ) {

        return DEFAULT_RATE;

    }


    return value;

}


/* ================================================
   CALCULATE EXTRA CHARGES
================================================ */

function calculateExtraCharges() {

    let total = 0;


    extraCharges.forEach(
        function (charge) {

            const amount =
                Number(charge.amount);


            if (
                Number.isFinite(amount)
            ) {

                total += amount;

            }

        }
    );


    return total;

}


/* ================================================
   CALCULATE TOTAL
================================================ */

function calculateTotal() {

    const rate =
        getDailyRate();


    const numberOfDays =
        selectedDates.length;


    const motorcycleCost =
        numberOfDays * rate;


    const extras =
        calculateExtraCharges();


    const total =
        motorcycleCost + extras;


    daysUsed.textContent =
        numberOfDays +
        (
            numberOfDays === 1
                ? " day"
                : " days"
        );


    rentalTotal.textContent =
        formatMoney(
            motorcycleCost
        );


    extraTotal.textContent =
        formatMoney(
            extras
        );


    grandTotal.textContent =
        formatMoney(
            total
        );


    renderSelectedDates();

}


/* ================================================
   DISPLAY SELECTED DATES
================================================ */

function renderSelectedDates() {

    selectedDatesContainer.innerHTML = "";


    if (
        selectedDates.length === 0
    ) {

        const empty =
            document.createElement("span");

        empty.className =
            "empty-message";

        empty.textContent =
            "No dates selected";


        selectedDatesContainer.appendChild(
            empty
        );


        return;

    }


    selectedDates.forEach(
        function (dateString) {

            const tag =
                document.createElement("span");


            tag.className =
                "date-tag";


            /*
            Add T00:00:00 so the browser
            doesn't shift the date because
            of timezone conversion.
            */

            const date =
                new Date(
                    dateString +
                    "T00:00:00"
                );


            tag.textContent =
                date.toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                    }
                );


            selectedDatesContainer.appendChild(
                tag
            );

        }
    );

}


/* ================================================
   ADD EXTRA CHARGE
================================================ */

function addNewCharge() {

    const charge = {

        id:
            Date.now() +
            Math.random(),

        description: "",

        amount: ""

    };


    extraCharges.push(
        charge
    );


    renderCharges();

    calculateTotal();

    saveData();

}


/* ================================================
   REMOVE EXTRA CHARGE
================================================ */

function removeCharge(id) {

    extraCharges =
        extraCharges.filter(
            function (charge) {

                return charge.id !== id;

            }
        );


    renderCharges();

    calculateTotal();

    saveData();

}


/* ================================================
   RENDER EXTRA CHARGES
================================================ */

function renderCharges() {

    chargesContainer.innerHTML = "";


    if (
        extraCharges.length === 0
    ) {

        const message =
            document.createElement("p");


        message.className =
            "help-text";


        message.textContent =
            "No extra charges added yet.";


        chargesContainer.appendChild(
            message
        );


        return;

    }


    extraCharges.forEach(
        function (charge) {

            const row =
                document.createElement("div");


            row.className =
                "charge";


            /*
            Description input
            */

            const description =
                document.createElement("input");


            description.type =
                "text";


            description.placeholder =
                "Example: Load";


            description.value =
                charge.description;


            /*
            Amount input
            */

            const amount =
                document.createElement("input");


            amount.type =
                "number";


            amount.placeholder =
                "Amount";


            amount.min =
                "0";


            amount.step =
                "0.01";


            amount.value =
                charge.amount;


            /*
            Remove button
            */

            const remove =
                document.createElement("button");


            remove.type =
                "button";


            remove.className =
                "remove-button";


            remove.textContent =
                "×";


            remove.title =
                "Remove charge";


            /*
            Description changed.
            */

            description.addEventListener(
                "input",
                function () {

                    charge.description =
                        description.value;

                    saveData();

                }
            );


            /*
            Amount changed.
            */

            amount.addEventListener(
                "input",
                function () {

                    charge.amount =
                        amount.value;

                    calculateTotal();

                    saveData();

                }
            );


            /*
            Remove clicked.
            */

            remove.addEventListener(
                "click",
                function () {

                    removeCharge(
                        charge.id
                    );

                }
            );


            row.appendChild(
                description
            );

            row.appendChild(
                amount
            );

            row.appendChild(
                remove
            );


            chargesContainer.appendChild(
                row
            );

        }
    );

}


/* ================================================
   SAVE DATA
================================================ */

function saveData() {

    const data = {

        customerName:
            customerName.value,

        dailyRate:
            dailyRate.value,

        selectedDates:
            selectedDates,

        extraCharges:
            extraCharges

    };


    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
        );


        showSavedMessage();

    } catch (error) {

        console.error(
            "Could not save data:",
            error
        );

    }

}


/* ================================================
   LOAD DATA
================================================ */

function loadData() {

    try {

        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );


        /*
        No previous data.
        */

        if (!saved) {

            dailyRate.value =
                DEFAULT_RATE;

            return;

        }


        const data =
            JSON.parse(saved);


        /*
        Customer
        */

        customerName.value =
            data.customerName || "";


        /*
        Rate
        */

        dailyRate.value =
            data.dailyRate || DEFAULT_RATE;


        /*
        Dates
        */

        if (
            Array.isArray(
                data.selectedDates
            )
        ) {

            selectedDates =
                data.selectedDates;

        }


        /*
        Extra charges
        */

        if (
            Array.isArray(
                data.extraCharges
            )
        ) {

            extraCharges =
                data.extraCharges;

        }

    } catch (error) {

        console.error(
            "Could not load saved data:",
            error
        );


        /*
        If saved data is corrupted,
        start fresh.
        */

        selectedDates = [];

        extraCharges = [];

        dailyRate.value =
            DEFAULT_RATE;

    }

}


/* ================================================
   SAVE MESSAGE
================================================ */

let saveTimer = null;


function showSavedMessage() {

    saveMessage.textContent =
        "✓ Saved automatically";


    clearTimeout(
        saveTimer
    );


    saveTimer =
        setTimeout(
            function () {

                saveMessage.textContent =
                    "";

            },
            1200
        );

}


/* ================================================
   PREVIOUS MONTH
================================================ */

previousMonth.addEventListener(
    "click",
    function () {

        currentDate =
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() - 1,
                1
            );


        renderCalendar();

    }
);


/* ================================================
   NEXT MONTH
================================================ */

nextMonth.addEventListener(
    "click",
    function () {

        currentDate =
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth() + 1,
                1
            );


        renderCalendar();

    }
);


/* ================================================
   RATE CHANGED
================================================ */

dailyRate.addEventListener(
    "input",
    function () {

        renderCalendar();

        calculateTotal();

        saveData();

    }
);


/* ================================================
   CUSTOMER NAME CHANGED
================================================ */

customerName.addEventListener(
    "input",
    function () {

        saveData();

    }
);


/* ================================================
   ADD CHARGE BUTTON
================================================ */

addCharge.addEventListener(
    "click",
    function () {

        addNewCharge();

    }
);


/* ================================================
   TODAY BUTTON
================================================ */

todayButton.addEventListener(
    "click",
    function () {

        currentDate =
            new Date();


        renderCalendar();

    }
);


/* ================================================
   PRINT BUTTON
================================================ */

printButton.addEventListener(
    "click",
    function () {

        window.print();

    }
);


/* ================================================
   CLEAR BUTTON
================================================ */

clearButton.addEventListener(
    "click",
    function () {

        const confirmed =
            window.confirm(
                "Clear all selected dates and extra charges?"
            );


        if (!confirmed) {

            return;

        }


        selectedDates = [];

        extraCharges = [];


        customerName.value = "";

        dailyRate.value =
            DEFAULT_RATE;


        try {

            localStorage.removeItem(
                STORAGE_KEY
            );

        } catch (error) {

            console.error(error);

        }


        renderCalendar();

        renderCharges();

        calculateTotal();


        saveMessage.textContent =
            "✓ Cleared";

    }
);


/* ================================================
   START APPLICATION
================================================ */

function startApp() {

    loadData();

    renderCalendar();

    renderCharges();

    calculateTotal();

}


/*
Run application.
*/

startApp();
