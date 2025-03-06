import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Survey.css"; // Custom styles

function SurveyForm() {
  const scriptURL = "https://script.google.com/macros/s/AKfycbxj5Ri4OTMWxFpbM7t_SzwDvHtO55vvcLENyDXKyBq57Fb7qshjHp8yT9yVMQtQxL-Raw/exec"

  const questions = [
    { id: "say", text: "What would you say about the app ?" },
    { id: "think", text: "What do you think about the app overall ?" },
    { id: "feel", text: "How does using the app make you feel ?" },
    { id: "improve", text: "Your Suggestion to improve the app ?" },
    { id: "occupation", text: "Your Occupation" },
  ];

  const [formData, setFormData] = useState({
    say: "",
    think: "",
    feel: "",
    improve: "",
    occupation: "",
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState(1);

  const handleChange = (e) => {
    setFormData({ ...formData, [questions[currentQuestion].id]: e.target.value });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      
      if (currentQuestion < questions.length) {
        nextQuestion();
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setDirection(1);
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));

    fetch(scriptURL, { method: "POST", body: form })
      .then((response) => {
        if (response.ok) {
          setMessage("Thank for your feedback😊");
          setTimeout(() => setMessage(""), 2000);
          setFormData({ say: "", think: "", feel: "", improve: "", occupation: "" });
          setCurrentQuestion(0);
        } else {
          throw new Error("Network response was not ok.");
        }
      })
      .catch((error) => console.error("Error!", error.message))
      .finally(() => setLoading(false));
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="card p-4 shadow-lg text-center w-100 mx-3 overall">
        <h1 >Survey Form</h1>
        <h5 >For TamilNadu Bus Booking App</h5>
        <p className="mb-4 text-muted">**For Project Purpose**</p>
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={direction}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="question-container"
            >

<label className="form-label">{questions[currentQuestion].text}</label>

                  </motion.div>
                  </AnimatePresence>
             
              <textarea
                name={questions[currentQuestion].id}
                className="form-control"
                rows="3"
                value={formData[questions[currentQuestion].id]}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                required
              />
              <small className="text-muted">Press **Shift + Enter** for a new line.</small>
          

          <div className="d-flex justify-content-between mt-4">
            {currentQuestion > 0 && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                type="button"
                className="btn btn-secondary"
                onClick={prevQuestion}
              >
                ← Previous
              </motion.button>
            )}
            {currentQuestion < questions.length - 1 ? (
               <motion.button
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               type="button"
               className="btn btn-primary"
               onClick={nextQuestion}
             >
               Next →
             </motion.button>
           ) : (
            <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="btn btn-success"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm"></span> Submitting...
              </>
            ) : (
              "Submit"
            )}
          </motion.button>
        )}
          </div>
        </form>

        {message && <p className="msg my-3">{message}</p>}
      </div>
    </div>
  );
}

export default SurveyForm;
