# Multiple choice exam form with Javascript
- Questions fetched from a JSON file
- Each question object contains: the question, the correct answer and an array of choices
- The exam form HTML code is generated with vanilla Javascript
- Once the exam form is generated the user has X minutes to complete the exam. A countdown timer is shown the screen. If time is up, the form is submitted for evaluation as is.
- Upon submit, a validation check is performed to see if the user selected an answer for each question. If not, the user is prompted for a choice: submit anyway or continue with the exam.
- Upon submit, a score is calculated and displayed with pass/fail message.