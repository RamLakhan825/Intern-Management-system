import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("internToken");
  const internId = localStorage.getItem("internId");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchExam = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/intern/exams/${examId}`,
        config
      );
      setExam(data);

      // Check if already submitted
      const existingScore = data.scores.find(
        (s) => s.intern === internId || s.intern?._id === internId
      );
      if (existingScore) {
        setScore(existingScore.score);
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load exam.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExam();
  }, [examId]);

  const handleSelect = (questionIndex, option) => {
    setAnswers({ ...answers, [questionIndex]: option });
  };

  const handleSubmit = async () => {
    if (!exam) return;

    const answerArray = Object.entries(answers).map(([questionIndex, answer]) => ({
      questionIndex: parseInt(questionIndex),
      answer,
    }));

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/intern/exams/${exam._id}/submit`,
        { answers: answerArray },
        config
      );

      setScore(data.score);
      setSubmitted(true);
      alert("Exam submitted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit exam");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading exam...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-r from-yellow-100 via-pink-100 to-purple-100">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-8">
        {exam.title} - {exam.topic}
      </h1>

      {!submitted ? (
        <div className="space-y-6 max-w-3xl mx-auto">
          {exam.questions.map((q, idx) => (
            <div key={idx} className="p-6 bg-white rounded-xl shadow">
              <h2 className="text-lg font-semibold mb-2">{q.question}</h2>
              <ul className="space-y-2">
                {q.options.map((opt, i) => (
                  <li key={i}>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${idx}`}
                        value={opt}
                        checked={answers[idx] === opt}
                        onChange={() => handleSelect(idx, opt)}
                        className="form-radio text-purple-600"
                      />
                      <span>{opt}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="mt-4 w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
          >
            Submit Exam
          </button>
        </div>
      ) : (
        <div className="text-center mt-10">
          <h2 className="text-3xl font-bold text-green-700">Exam Completed!</h2>
          <p className="text-xl mt-4">
            Your score: <span className="font-semibold">{score}</span> / {exam.questions.length}
          </p>
          <button
            onClick={() => navigate("/intern/dashboard")}
            className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

export default TakeExam;
