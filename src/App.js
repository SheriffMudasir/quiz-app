import { useState, useEffect } from 'react';

const shuffleAndSelectQuestions = (questions) => {
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 30);
};

const QuizApp = () => {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [passed, setPassed] = useState(0);  // Track correct answers
  const [failed, setFailed] = useState(0);  // Track incorrect answers
  const [selectedOption, setSelectedOption] = useState('');
  const [userAnswers, setUserAnswers] = useState([]);  // Track user's answers

  // Fetch the questions from the JSON file
  useEffect(() => {
    fetch('/questions.json')
      .then((response) => response.json())
      .then((data) => {
        setShuffledQuestions(shuffleAndSelectQuestions(data));
      })
      .catch((error) => console.error('Error fetching questions:', error));
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newUserAnswers);

    if (selectedOption === shuffledQuestions[currentQuestion].answer) {
      setPassed(passed + 1);
    } else {
      setFailed(failed + 1);
    }

    setCurrentQuestion(currentQuestion + 1);
    setSelectedOption('');
  };

  const handleRestart = () => {
    fetch('/questions.json')
      .then((response) => response.json())
      .then((data) => {
        setShuffledQuestions(shuffleAndSelectQuestions(data));
        setCurrentQuestion(0);
        setPassed(0);
        setFailed(0);
        setSelectedOption('');
        setUserAnswers([]);  // Reset user answers
      })
      .catch((error) => console.error('Error fetching questions:', error));
  };

  if (currentQuestion >= shuffledQuestions.length) {
    return (
      <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
        <h2 className="text-lg font-bold mb-4">Quiz Finished!</h2>
        <p className="text-lg font-bold mb-4">Number passed: {passed}</p>
        <p className="text-lg font-bold mb-4">Number failed: {failed}</p>
        <p className="italic mb-4">
        Buy Dr. AI a coffee <a href="https://paystack.com/pay/scj36fu7mx" className="text-blue-500 underline">here</a>.
      </p>
        <ul className="text-left">
          {shuffledQuestions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.answer;
            return (
              <li key={index} className="mb-4">
                <p className="font-bold">{index + 1}. {question.question}</p>
                <ul>
                  {question.options.map((option, optIndex) => (
                    <li key={optIndex} className={`ml-4 ${userAnswers[index] === option ? (isCorrect ? 'text-green-500' : 'text-red-500') : ''}`}>
                      {option === question.answer ? (
                        <span className="text-green-500">✔</span>
                      ) : userAnswers[index] === option ? (
                        <span className="text-red-500">✘</span>
                      ) : null}{' '}
                      {option}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <button className="btn btn-primary" onClick={handleRestart}>
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-md shadow-md">
      {/* Banner Image */}
      <img src="/banner.jpg" alt="Banner" className="img-fluid mb-4" />

      {/* Italic Text with Embedded Link */}
      <p className="italic mb-4">
        Buy Dr. AI a coffee <a href="https://paystack.com/pay/scj36fu7mx" className="text-blue-500 underline">here</a>.
      </p>

      <h1 className="text-xl font-bold mb-4">This app was created by Sheriff Olalekan Mudasir aka Dr. AI</h1>
      <h1 className="text-xl font-bold mb-4">ARC3231 History of Architecture III </h1>
      <h2 className="text-lg font-bold mb-4">Question {currentQuestion + 1} of {shuffledQuestions.length}</h2>
      <p className="text-lg font-bold mb-4">{shuffledQuestions[currentQuestion]?.question}</p>
      <ul>
        {shuffledQuestions[currentQuestion]?.options.map((option, index) => (
          <li key={index}>
            <input
              type="radio"
              id={option}
              name="option"
              value={option}
              checked={selectedOption === option}
              onChange={() => handleOptionChange(option)}
            />
            <label htmlFor={option} className="ml-2">{option}</label>
          </li>
        ))}
      </ul>
      <button className="btn btn-success mt-4" onClick={handleNextQuestion}>
        Next Question
      </button>
    </div>
  );
};

export default QuizApp;
