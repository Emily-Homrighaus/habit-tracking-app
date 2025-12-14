import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Record() {
  const [form, setForm] = useState({
    foodItem: "",
    calories: "",
    eatenAt: "",
  });
  const [isNew, setIsNew] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id?.toString() || undefined;
      if(!id) return;
      setIsNew(false);
      const response = await fetch(
        `/record/${params.id.toString()}`
      );
      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const record = await response.json();
      if (!record) {
        console.warn(`Record with id ${id} not found`);
        navigate("/");
        return;
      }
      setForm(record);
    }
    fetchData();
    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
async function onSubmit(e) {
  e.preventDefault();

  const entry = {
    foodItem: form.foodItem,
    calories: Number(form.calories),
    eatenAt: form.eatenAt,
  };

  try {
    let response;

    if (isNew) {
      // create new calorie entry
      response = await fetch("/record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });
    } else {
      // update existing calorie entry
      response = await fetch(`/record/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entry),
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("A problem occurred with your fetch operation:", error);
  } finally {
    setForm({
      foodItem: "",
      calories: "",
      eatenAt: "",
    });
    navigate("/");
  }
}


  // This following section will display the form that takes the input from the user.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Create/Update Diet Record</h3>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Food item"
          value={form.foodItem}
          onChange={(e) => setForm({ ...form, foodItem: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Calories"
          value={form.calories}
          onChange={(e) => setForm({ ...form, calories: e.target.value })}
          min="0"
          required
        />

        <input
          type="datetime-local"
          value={form.eatenAt}
          onChange={(e) => setForm({ ...form, eatenAt: e.target.value })}
          required
        />

        <button type="submit">Add Entry</button>
      </form>

    </>
  );
}